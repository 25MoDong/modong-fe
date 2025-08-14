import { useState, useEffect } from 'react';

const TestUserSelect = ({ onComplete }) => {
  const users = [
    {
      id: 'feellikemang',
      name: '느좋돌맹이',
      preferences: {
        atmosphere: ['분위기 있는', '기념일에 가기 좋은'],
        taste: ['디저트가 맛있는', '음료가 달달한'],
      },
    },
    {
      id: 'alcoholmang',
      name: '술좋아돌맹이',
      preferences: {
        atmosphere: ['옛날 감성', '가성비 좋은'],
        taste: ['안주가 맛있는', '술 종류가 다양한'],
      },
    },
  ];

  const [userTags, setUserTags] = useState({});

  const getDisplayTags = (preferences, maxCount = 3) => {
    let allSelectedTags = [];
    // 코드를 조금 최적화할 수 있을 것 같은데... api를 받고나서 고민해보자.
    // 객체를 [key, value]의 형태로 forEach 실행
    Object.values(preferences).forEach(tags => {
      const pickCount = Math.random() < 0.2 ? 1 : 2;
      // 음수면 순서가 바뀌고, 양수면 그대로
      const suffled = [...tags].sort(() => Math.random() - 0.5);
      const picked = suffled.slice(0, Math.min(pickCount, tags.length));

      allSelectedTags.push(...picked);
    });

    return allSelectedTags.slice(0, maxCount).map(tag => `# ${tag}`);
  };
  const handleUserSelect = user => {
    setTimeout(() => {
      onComplete(user);
    }, 250);
  };

  useEffect(() => {
    const tags = {};
    users.forEach(user => {
      tags[user.id] = getDisplayTags(user.preferences, 3);
    });
    setUserTags(tags);
  }, []);

  return (
    <div className="w-full h-full relative bg-white px-3 py-4 flex flex-col items-center justify-center whitespace-nowrap transform -translate-y-12 ">
      <h1 className="text-2xl font-bold text-center mb-12">
        테스트 유저를 선택해주세요
      </h1>

      <div className="flex max-w-full gap-4 mb-12">
        {users.map(user => {
          return (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="relative bg-white rounded-2xl p-6 cursor-pointer shadow-gray-500 shadow-md duration-200 ease-out transition-all active:scale-95 active:ring-4 active:ring-primary-500 w-64 h-80"
            >
              {/* 프로필 이미지 */}
              <div className="bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src="images/profile.png"
                  alt="돌맹 프로필 이미지"
                  className="w-32 h-auto object-contain object-center"
                  style={{
                    WebkitUserDrag: 'none',
                  }}
                />
              </div>
              {/* 이름 */}
              <h3 className="text-lg font-bold text-center mb-4">
                {user.name}
              </h3>
              {/* 태그 */}
              <div className="flex flex-col items-center gap-2">
                {userTags[user.id]?.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-primary-500 rounded-lg text-secondary-500 text-center text-sm w-fit px-2 py-1"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestUserSelect;
