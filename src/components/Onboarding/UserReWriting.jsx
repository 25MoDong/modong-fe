const UserReWriting = ({ user, onComplete }) => {
  const handleReWriting = () => {
    onComplete();
  };

  return (
    <div>
      <p>재정의 테스트 페이지</p>
      <div>
        <div>{user?.id}</div>
        <button onClick={() => handleReWriting()} className="bg-secondary-500 ">
          다음 화면으로 가기
        </button>
      </div>
    </div>
  );
};

export default UserReWriting;
