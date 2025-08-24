import { useState, useEffect } from 'react';
import backend from '../../lib/backend';
import { FilterTag } from '../common/FilterTags';

const TestUserSelect = ({ onComplete }) => {
  const [users, setUsers] = useState([]);
  const [userTags, setUserTags] = useState({});

  const handleUserSelect = user => {
    setTimeout(async () => {
      // persist selected user id
      try {
        const userModule = (await import('../../lib/userStore')).default;
        await userModule.setUser(user);
      } catch (e) {}
      // 온보딩 완료는 UserReWriting 단계 완료 후에 처리
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
    <div className="w-full h-full relative bg-white px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-center text-black font-semibold text-2xl leading-7 mb-16">
        카테고리가 미리 선택된<br />
        테스트유저를 선택해 주세요
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        {users.slice(0, 2).map((user, userIndex) => (
          <div
            key={user.id}
            onClick={() => handleUserSelect(user)}
          className="relative w-full h-[184px] bg-secondary-600 border border-[#212842] rounded-[10px] cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* 프로필 이미지 */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[119px] h-[118px] bg-white border border-[rgba(60,68,98,0.25)] shadow-[0px_0px_6.1px_1px_rgba(0,0,0,0.13)] rounded-[10px] flex items-center justify-center">
              <img
                src="/images/dolmaeng.png"
                alt="돌맹 프로필 이미지"
                className="w-20 h-16 object-contain"
                draggable="false"
                style={{
                  WebkitUserDrag: 'none',
                }}
              />
            </div>

            {/* 태그들 - flex-wrap으로 자연스럽게 배치 */}
            <div className="absolute left-[155px] top-1/2 -translate-y-1/2 right-4 flex flex-wrap gap-2 items-start justify-center">
              {userTags[user.id]?.map((tag, index) => (
                <FilterTag
                  key={index}
                  className="text-xs"
                >
                  {tag.replace('# ', '')}
                </FilterTag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestUserSelect;
