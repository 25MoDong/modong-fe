const UserReWriting = ({ user, onComplete }) => {
  const handleReWriting = () => {
    // 온보딩 완료 처리
    try { 
      localStorage.setItem('onboarding_completed', '1'); 
    } catch (e) {}
    
    // 온보딩 완료 이벤트 발생
    window.dispatchEvent(new Event('OnboardingCompleted'));
    
    onComplete();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">재정의 테스트 페이지</h2>
        <p className="text-gray-600 mb-2">선택된 사용자: <span className="font-semibold text-primary-600">{user?.id}</span></p>
        <p className="text-sm text-gray-500">다음 단계에서 취향을 재정의하게 됩니다.</p>
      </div>
      
      <button 
        onClick={handleReWriting} 
        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        다음 화면으로 가기
      </button>
    </div>
  );
};

export default UserReWriting;
