import { useState, useEffect } from 'react';
import backend from '../../lib/backend';

const TestUserSelect = ({ onComplete }) => {
  const [users, setUsers] = useState([]);
  const [userTags, setUserTags] = useState({});

  const handleUserSelect = user => {
    setTimeout(async () => {
      // persist selected user id and notify listeners
      try {
        const userModule = (await import('../../lib/userStore')).default;
        await userModule.setUser(user);
      } catch (e) {}
      // mark onboarding completed so AppInitializer can proceed
      try { localStorage.setItem('onboarding_completed', '1'); } catch (e) {}
      window.dispatchEvent(new Event('OnboardingCompleted'));
      onComplete(user);
    }, 250);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await backend.getAllUsers();
        if (!mounted) return;
        setUsers(list || []);
        const tags = {};
        (list || []).forEach(u => {
          tags[u.id] = Array.isArray(u.userMood) ? u.userMood.slice(0, 4).map(t => `# ${t}`) : [];
        });
        setUserTags(tags);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    load();
    return () => { mounted = false; };
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
              <div className="rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src="images/dolmaeng.png"
                  alt="돌맹 프로필 이미지"
                  className="w-32 h-auto object-contain object-center"
                  draggable="false"
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
