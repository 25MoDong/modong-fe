import { useEffect, useState } from "react"
import Loading from "./Onboarding/Loading";

const AppInitializer = ({ children }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
      // 이미 초기화되었으면 로딩 건너뛰기
      if (isInitialized) return;

      const navigationType = performance.getEntriesByType('navigation')[0]?.type;

      // 새로고침 또는 처음 방문 시에만 로딩 표시
      const shouldShowLoading = navigationType === 'reload' || navigationType === 'navigate';

      setShowLoading(shouldShowLoading);
      setIsInitialized(true);
    }, [isInitialized]);

    const handleLoadingComplete = () => {
      setShowLoading(false);
    };

    if (!isInitialized || showLoading) {
      return <Loading onComplete={handleLoadingComplete} />;
    }

    return children;
  };

export default AppInitializer;
