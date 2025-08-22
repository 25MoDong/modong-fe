import { useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import SearchBar from "../components/common/SearchBar";
import BackButton from "../components/common/BackButton";
import PlaceCards from "../components/common/PlaceCards";
import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx';
import {
  loadCollections, loadMapping, saveMapping, addCollection, recountCollectionCounts, savePlace
} from '../lib/favoritesStorage.js';
import { dummyPlaces } from "../lib/dummyData";

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
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Save to recent searches
    saveRecentSearch(query);

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual search logic
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Search in actual dummy data first
      const searchResults = dummyPlaces.filter(place => 
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.category.toLowerCase().includes(query.toLowerCase()) ||
        place.address.full.toLowerCase().includes(query.toLowerCase())
      );

      // If no exact matches found, use mock data for demo
      if (searchResults.length === 0) {
        // Check if query matches any common categories for related suggestions
        const hasRelatedPlaces = dummyPlaces.some(place => 
          place.category.includes(query.toLowerCase()) ||
          place.tags?.some(tag => tag.includes(query.toLowerCase()))
        );
        
        if (!hasRelatedPlaces) {
          // No results and no related places - will show tag-based suggestions
          setSearchResults([]);
        } else {
          // Mock results for demo
          const mockResults = [
            { 
              id: 1, 
              name: `${query}에 대한 검색 결과 1`, 
              address: '서울시 강남구',
              type: 'place',
              category: 'cafe',
              rating: { average: 4.5, count: 120 },
              coordinates: { lat: 37.5665, lng: 126.9780 }
            },
            { 
              id: 2, 
              name: `${query}에 대한 검색 결과 2`, 
              address: '서울시 서초구',
              type: 'place',
              category: 'restaurant',
              rating: { average: 4.2, count: 85 },
              coordinates: { lat: 37.5670, lng: 126.9785 }
            }
          ];
          setSearchResults(mockResults);
          
          // Navigate to map with mock results
          navigate('/map', {
            state: {
              searchResults: mockResults,
              selectedResult: mockResults[0]
            }
          });
        }
      } else {
        setSearchResults(searchResults);
        
        // If results found, automatically navigate to map with results
        navigate('/map', {
          state: {
            searchResults: searchResults,
            selectedResult: searchResults[0] // Select first result by default
          }
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, saveRecentSearch]);

  // Handle selecting a search result
  const handleSelectResult = useCallback((result) => {
    if (fromPage === 'map') {
      // Navigate back to map with selected result
      navigate('/map', {
        state: {
          searchResults: searchResults,
          selectedResult: result
        }
      });
    } else {
      // For home page or other sources, navigate to map
      navigate('/map', {
        state: {
          searchResults: searchResults,
          selectedResult: result
        }
      });
    }
  }, [navigate, fromPage, searchResults]);

  // Get suggested places by tags when no search results
  const getSuggestedPlaces = useCallback(() => {
    if (!searchQuery || searchResults.length > 0) return {};
    
    // Group places by category for suggestions
    const suggestions = {
      cafe: dummyPlaces.filter(place => place.category === 'cafe').slice(0, 4),
      restaurant: dummyPlaces.filter(place => place.category === 'restaurant').slice(0, 4),
      attraction: dummyPlaces.filter(place => place.category === 'attraction').slice(0, 4)
    };
    
    return suggestions;
  }, [searchQuery, searchResults]);

  const suggestedPlaces = getSuggestedPlaces();

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
    const cols = loadCollections();
    setPickerCollections(cols);
    setPickerSelectedIds([]);
    setPickerPlace(place);
    setPickerOpen(true);
  }, []);

  const pickerToggle = useCallback((cid) => {
    setPickerSelectedIds(prev => prev.includes(cid) ? prev.filter(v => v !== cid) : [...prev, cid]);
  }, []);

  const pickerSave = useCallback(() => {
    if (!pickerPlace) return setPickerOpen(false);
    // Save place to cache then save mapping
    savePlace(pickerPlace);
    const map = loadMapping();
    map[String(pickerPlace.id)] = pickerSelectedIds;
    saveMapping(map);
    recountCollectionCounts();
    setPickerOpen(false);
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
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900">{result.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {typeof result.address === 'string' ? result.address : result.address?.full || result.address?.district || '주소 정보 없음'}
                  </p>
                  {/* Rating removed per UI change request */}
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          // Show no results message with cute design
          <div className="py-8 px-4">
            {/* Dolmaeng character and speech bubble in row */}
            <div className="flex items-center gap-4 mb-8">
              {/* Dolmaeng character */}
              <div className="flex-shrink-0">
                <img 
                  src="/images/dolmaeng.png" 
                  alt="돌맹이 캐릭터" 
                  className="w-20 h-20 object-contain"
                  draggable="false"
                  style={{ WebkitUserDrag: 'none' }}
                />
              </div>
              
              {/* Speech bubble from left */}
              <div className="relative bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 flex-1 max-w-xs">
                <p className="text-sm text-gray-700">
                  앗! 찾으시는 <span className="text-orange-500 font-semibold">{searchQuery}</span>을<br />
                  파는 가게를 찾지 못했어요 😅
                </p>
                {/* Speech bubble tail pointing left */}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45"></div>
              </div>
            </div>
            
            {/* Suggestion text */}
            <p className="text-center text-gray-600 text-lg font-medium mb-6">
              대신, 이런건 어떠세요?
            </p>
            
            {/* Suggested menu items with stores - render using PlaceCards beneath the menu label */}
            <div className="space-y-6">
              {/* 추천 메뉴 리스트 */}
              {[
                {
                  keyword: '바나나크림브륄레',
                  stores: [
                    { id: 's1', name: '카페명1', category: '종류', image: '/images/cafe1.jpg' },
                    { id: 's2', name: '카페명2', category: '종류', image: '/images/cafe2.jpg' },
                    { id: 's3', name: '카페명3', category: '종류', image: '/images/cafe3.jpg' }
                  ]
                },
                {
                  keyword: '바나나 스무디',
                  stores: [
                    { id: 's4', name: '카페명4', category: '종류', image: '/images/cafe4.jpg' },
                    { id: 's5', name: '카페명5', category: '종류', image: '/images/cafe5.jpg' },
                    { id: 's6', name: '카페명6', category: '종류', image: '/images/cafe6.jpg' }
                  ]
                }
              ].map((menu, menuIndex) => (
                <div key={menuIndex} className="space-y-3">
                  {/* 키워드 카테고리 (라벨) */}
                  <div className="flex justify-start px-2">
                    <div className="bg-white border-2 border-[#F1CD87] rounded-[10px] px-4 py-2">
                      <span className="text-[#F1CD87] text-xs font-semibold">{menu.keyword}</span>
                    </div>
                  </div>

                  {/* 메뉴 라벨 아래에 PlaceCards 컴포넌트 배치 (홈과 유사한 방식, horizontal scroll) */}
                  <div className="px-2">
                    <PlaceCards
                      places={menu.stores.map((s, idx) => ({
                        id: s.id ?? `menu-${menuIndex}-${idx}`,
                        name: s.name,
                        category: s.category,
                        image: s.image
                      }))}
                      layout="scroll"
                      variant="compact"
                      onLikeToggle={openPickerForPlace}
                    />
                  </div>
                </div>
              ))}
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
