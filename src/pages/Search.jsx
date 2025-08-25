import { useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import SearchBar from "../components/common/SearchBar";
import BackButton from "../components/common/BackButton";
import PlaceCards from "../components/common/PlaceCards";
import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx';
import {
  loadCollections as loadLocalCollections, loadMapping, saveMapping, addCollection as addLocalCollection, recountCollectionCounts, savePlace
} from '../lib/favoritesStorage.js';
import { loadCollections as apiLoadCollections, addPlaceToCollection } from '../lib/favoritesApi';
import backend from '../lib/backend';
import { searchStores as apiSearchStores, getAllLocations, getLocationByStoreId } from '../lib/storeApi';
import { CATEGORY_CONFIG } from '../lib/constants';
// suggestions will be loaded from backend stores

const RECENT_SEARCHES_KEY = 'modong_recent_searches';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const variant = location.state?.variant || 'light';
  const fromPage = location.state?.from; // 'map' or 'home'
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        const parsedSearches = JSON.parse(saved);
        setRecentSearches(parsedSearches);
      } catch (error) {
        console.error('Error parsing recent searches:', error);
        setRecentSearches(['바나나푸딩', '연남 작당모의', '바나나 크림브륄레']);
      }
    } else {
      // Default recent searches
      setRecentSearches(['바나나푸딩', '연남 작당모의', '바나나 크림브륄레']);
    }
  }, []);

  // Save recent search to localStorage
  const saveRecentSearch = useCallback((query) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(search => search !== query)].slice(0, 10); // Keep max 10 searches
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
      return newSearches;
    });
  }, []);

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    saveRecentSearch(query);
    setIsLoading(true);
    try {
      // Use storeApi.searchStores to get normalized store objects
      const results = await apiSearchStores(query);
      if (!results || results.length === 0) {
        setSearchResults([]);
      } else {
        setSearchResults(results);
        navigate('/map', { state: { searchResults: results, selectedResult: results[0] } });
      }
    } catch (err) {
      console.error('Search error', err);
      setSearchResults([]);
    } finally { setIsLoading(false); }
  }, [navigate, saveRecentSearch]);

  // Handle selecting a search result
  const handleSelectResult = useCallback(async (result) => {
    // Ensure result has coordinates; if missing, try to find from v7 locations
    let resolved = result;
    if (!resolved || !resolved.coordinates || !resolved.coordinates.lat || !resolved.coordinates.lng) {
      try {
        const storeId = result.storeId || result.id || result.storeId;
        if (storeId) {
          const loc = await getLocationByStoreId(storeId);
          if (loc) resolved = { ...resolved, coordinates: loc };
        }
      } catch (err) {
        console.warn('Failed to resolve coordinates for selected result:', err);
      }
    }

    // Navigate to map with the resolved selectedResult
    navigate('/map', {
      state: {
        searchResults: searchResults,
        selectedResult: resolved
      }
    });
  }, [navigate, searchResults]);

  const [suggestedPlaces, setSuggestedPlaces] = useState({});

  // Load suggested places from backend when there are no search results
  useEffect(() => {
    let mounted = true;
    const loadSuggestions = async () => {
      // Only load suggestions when there are no search results to show
      if (searchResults && searchResults.length > 0) return;
      try {
        const stores = await backend.getAllStores();
        if (!mounted || !Array.isArray(stores)) return;
        // Classify by explicit category field matching CATEGORY_CONFIG names
        const cafeName = CATEGORY_CONFIG.cafe.name;
        const restaurantName = CATEGORY_CONFIG.restaurant.name;
        const cafeList = stores.filter(s => (s.category || '') === cafeName).slice(0, 8);
        const restaurantList = stores.filter(s => (s.category || '') === restaurantName).slice(0, 8);
        const others = stores.filter(s => (s.category || '' ) !== cafeName && (s.category || '' ) !== restaurantName).slice(0, 12);
        setSuggestedPlaces({
          cafe: cafeList,
          restaurant: restaurantList,
          attraction: stores.filter(s => (s.category || '').toLowerCase().includes('관광') || (s.category || '').toLowerCase().includes('attraction')).slice(0,4),
          all: others
        });
      } catch (err) {
        console.error('Failed to load suggested places from backend', err);
        setSuggestedPlaces({});
      }
    };
    loadSuggestions();
    return () => { mounted = false; };
  }, [searchResults]);

  // Favorites picker state (for heart button)
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCollections, setPickerCollections] = useState([]);
  const [pickerSelectedIds, setPickerSelectedIds] = useState([]);
  const [pickerPlace, setPickerPlace] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const openPickerForPlace = useCallback((place, liked) => {
    if (!place || !place.id) return;
    // If the action is to unlike (cancel), remove the place from all collections immediately and do NOT open the picker
    if (liked === false) {
      const map = loadMapping();
      if (map[String(place.id)]) {
        delete map[String(place.id)];
        saveMapping(map);
        recountCollectionCounts();
      }
      return;
    }

    // For like action, open the picker with NO preselected items (user must choose)
    (async () => {
      try {
        const cols = await apiLoadCollections();
        setPickerCollections(cols);
      } catch (err) {
        console.warn('Failed to load collections from API, falling back to local', err);
        setPickerCollections(loadLocalCollections());
      }
    })();
    setPickerSelectedIds([]);
    setPickerPlace(place);
    setPickerOpen(true);
  }, []);

  const pickerToggle = useCallback((cid) => {
    setPickerSelectedIds(prev => prev.includes(cid) ? prev.filter(v => v !== cid) : [...prev, cid]);
  }, []);

  const pickerSave = useCallback(() => {
    if (!pickerPlace) return setPickerOpen(false);
    // Save place to cache then persist selection via API
    (async () => {
      savePlace(pickerPlace);
      const before = loadMapping()[String(pickerPlace.id)] || [];
      const after = pickerSelectedIds || [];

      // Add newly selected
      for (const cid of after) {
        if (!before.includes(cid)) {
          try { await addPlaceToCollection(String(pickerPlace.id), cid); } catch (err) { console.warn('addPlaceToCollection failed', err); }
        }
      }

      // Note: removal via API is not handled here; if needed implement removePlaceFromCollection

      const map = loadMapping();
      map[String(pickerPlace.id)] = after;
      saveMapping(map);
      recountCollectionCounts();
      setPickerOpen(false);
    })();
  }, [pickerPlace, pickerSelectedIds]);

  const handleCreateNewCollection = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleSubmitNewCollection = useCallback(({ title, description }) => {
    if (!title?.trim()) return;
    const newC = addCollection({ title: title.trim(), description: description?.trim() });
    // Just refresh collections list. Do NOT auto-add the current place to the new collection.
    setPickerCollections(recountCollectionCounts());
    setAddOpen(false);
  }, [pickerPlace]);

  return(
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="relative w-full h-screen flex flex-col">
        {/* Header with search */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex flex-row items-center gap-3 px-4 py-3">
            <BackButton/>
            <SearchBar 
              variant={variant} 
              clickable={false} 
              className="mt-0"
              onSearch={handleSearch}
              placeholder="장소나 메뉴를 검색해보세요"
            />
          </div>
        </div>

        {/* Search results */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6 pb-24" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">검색 중...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              검색 결과 ({searchResults.length}개)
            </h2>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div 
                  key={result.id || result.storeId}
                  onClick={() => handleSelectResult(result)}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900">{result.storeName || result.name || result.title || ''}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {result.address || result.detail || result.address?.full || result.address?.district || '주소 정보 없음'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          // Show no results message and suggested stores fetched from backend
          <div className="py-8 px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-shrink-0">
                <img 
                  src="/images/dolmaeng.png" 
                  alt="돌맹이 캐릭터" 
                  className="w-20 h-20 object-contain"
                  draggable="false"
                  style={{ WebkitUserDrag: 'none' }}
                />
              </div>
              <div className="relative bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 flex-1 max-w-xs">
                <p className="text-sm text-gray-700">
                  앗! 찾으시는 <span className="text-orange-500 font-semibold">{searchQuery}</span>을<br />
                  파는 가게를 찾지 못했어요 😅
                </p>
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45"></div>
              </div>
            </div>

            <p className="text-center text-gray-600 text-lg font-medium mb-6">대신, 이런 가게들을 보여드릴게요</p>

            <div className="space-y-6">
              {['cafe','restaurant','attraction','all'].map((cat) => {
                const list = suggestedPlaces[cat] || [];
                if (!list || list.length === 0) return null;
                return (
                  <div key={cat} className="space-y-3">
                    <div className="flex justify-start px-2">
                      <div className="bg-white border-2 border-[#F1CD87] rounded-[10px] px-4 py-2">
                        <span className="text-[#F1CD87] text-xs font-semibold">{cat === 'all' ? '추천 매장' : cat}</span>
                      </div>
                    </div>
                    <div className="px-2">
                      <PlaceCards
                        places={list.map((s, idx) => ({
                          id: s.id ?? s.storeId ?? `suggest-${cat}-${idx}`,
                          name: s.storeName || s.name || s.title || '',
                          category: s.category || '',
                          image: (s.images && s.images[0]) || s.image || '/images/tmp.jpg'
                        }))}
                        layout="scroll"
                        variant="compact"
                        onLikeToggle={openPickerForPlace}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Default state - show recent search and popular categories
          <div className="space-y-6 pt-4">
            {/* Recent Search */}
            <div className="px-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">최근 검색어</h3>
              {recentSearches.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    전체삭제
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm border border-orange-200 hover:bg-orange-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">최근 검색어가 없습니다</p>
                )}
              </div>
            </div>

            {/* Popular Location Categories */}
            <div className="px-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">인기 장소 카테고리</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"># 분위기 좋은</span>
                <span className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"># 데이트 하기 좋은</span>
                <span className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"># 데이트 하기</span>
                <span className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"># 데이트 하기 좋은</span>
                <span className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"># 분위기 좋은</span>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Favorites picker sheet for when heart button is clicked on a card */}
      <FavoritesPickerSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        collections={pickerCollections}
        selectedIds={pickerSelectedIds}
        onToggle={pickerToggle}
        onCreateNew={handleCreateNewCollection}
        onSave={pickerSave}
      />

      <AddCollectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleSubmitNewCollection}
      />
    </>
  );
}

export default Search;
