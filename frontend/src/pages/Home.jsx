const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          성북구 AI 맛집 추천
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          당신이 좋아했던 다른 지역의 맛집과 유사한
          <br />
          성북구의 숨은 맛집을 AI가 추천해드립니다
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI 추천</h3>
          <p className="text-gray-600 mb-4">
            취향 기반 맞춤 맛집 추천
          </p>
          <button className="btn-primary">
            추천받기
          </button>
        </div>

        <div className="card text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">맛집 검색</h3>
          <p className="text-gray-600 mb-4">
            원하는 조건으로 맛집 찾기
          </p>
          <button className="btn-secondary">
            검색하기
          </button>
        </div>

        <div className="card text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">주변 맛집</h3>
          <p className="text-gray-600 mb-4">
            현재 위치 기반 맛집 찾기
          </p>
          <button className="btn-secondary">
            둘러보기
          </button>
        </div>
      </div>

      {/* Popular Restaurants */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">인기 맛집</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card hover:shadow-md transition-shadow">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-1">맛집 이름</h3>
              <p className="text-sm text-gray-600 mb-2">한식 • 성북구</p>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
                <span className="ml-1 text-sm text-gray-600">4.8</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;