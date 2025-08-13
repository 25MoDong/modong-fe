import { useState } from 'react';
import Loading from "./Loading";
import TestUserSelect from './TestUserSelect';
import UserReWriting from './UserReWriting';
import Home from './Home';


const Prepare = () => {
    const [curStep, setCurStep] = useState('loading');
    const [selectedUser, setSelectedUser] = useState(null);

    const handleStepComplete = (step, data) => {
        switch(step) {
            case 'loading':
                setCurStep('testuser');
                break;
            case 'testuser':
                setSelectedUser(data);
                setCurStep('rewriting');
                break;
            case 'rewriting':
                setCurStep('home');
                break;
        }
    }
    
    return (
        <>
            {curStep === 'loading' && (
                <Loading onComplete={() => handleStepComplete('loading')}/>
            )}
            {curStep === 'testuser' && (
                <TestUserSelect onComplete={(user) => handleStepComplete('testuser', user)}/>
            )}
            {curStep === 'rewriting' && (
                <UserReWriting 
                    user={selectedUser} 
                    onComplete={() => handleStepComplete('rewriting')}/>
            )}
            {curStep === 'home' && (
                <Home user={selectedUser} />
            )}
        </>
    );
}

export default Prepare;