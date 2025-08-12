import { useState } from 'react';
import Loading from "./Loading";

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    if (isLoading) {
      return <Loading onComplete={() => setIsLoading(false)} />;
    }
    return (
        <div>로딩이 완료된 홈 화면</div>
    );
}

export default Home;