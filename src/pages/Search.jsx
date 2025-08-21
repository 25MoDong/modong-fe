import { useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import SearchBar from "../components/common/SearchBar";
import BackButton from "../components/common/BackButton";
import PlaceCards from "../components/common/PlaceCards";
import { dummyPlaces } from "../lib/dummyData";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const variant = location.state?.variant || 'light';
  const fromPage = location.state?.from; // 'map' or 'home'
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

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
  }, [navigate]);

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

  return(
    <div className="relative w-full min-h-screen flex flex-col">
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
      <div className="flex-1 px-4 py-6">
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
                  {result.rating && (
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {result.rating.average} ({result.rating.count}개 리뷰)
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery && Object.keys(suggestedPlaces).length > 0 ? (
          // Show suggested places by category when no search results
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">'{searchQuery}'에 대한 검색 결과가 없습니다</p>
              <p className="text-sm text-gray-400">대신 이런 장소들은 어떠세요?</p>
            </div>
            
            {/* Recent Search Tags */}
            <div className="px-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">최근 검색어</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm border border-orange-200">바나나푸딩</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm border border-orange-200">연남 작당모의</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm border border-orange-200">바나나 크림브륄레</span>
              </div>
            </div>

            {/* Popular Location Categories */}
            <div className="px-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">인기 장소 카테고리</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"># 분위기 좋은</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"># 데이트 하기 좋은</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"># 데이트 하기</span>
              </div>
            </div>

            {/* Suggested Places */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 px-4">이 장소와 유사한 장소 보기</h3>
              
              {/* Cafe Cards */}
              {suggestedPlaces.cafe && suggestedPlaces.cafe.length > 0 && (
                <div className="mb-6">
                  <PlaceCards 
                    places={suggestedPlaces.cafe}
                    variant="compact"
                    layout="scroll"
                    className="px-0"
                  />
                </div>
              )}
              
              {/* Restaurant Cards */}
              {suggestedPlaces.restaurant && suggestedPlaces.restaurant.length > 0 && (
                <div className="mb-6">
                  <PlaceCards 
                    places={suggestedPlaces.restaurant}
                    variant="compact"
                    layout="scroll"
                    className="px-0"
                  />
                </div>
              )}
              
              {/* Attraction Cards */}
              {suggestedPlaces.attraction && suggestedPlaces.attraction.length > 0 && (
                <div className="mb-6">
                  <PlaceCards 
                    places={suggestedPlaces.attraction}
                    variant="compact"
                    layout="scroll"
                    className="px-0"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">검색어를 입력해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
