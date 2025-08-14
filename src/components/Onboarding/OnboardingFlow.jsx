import { useState } from 'react';
import Loading from './Loading';
import TestUserSelect from './TestUserSelect';
import UserReWriting from './UserReWriting';

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState('loading');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleStepComplete = (step, user) => {
    switch (step) {
      case 'loading':
        setStep('testuser');
        break;
      case 'testuser':
        setSelectedUser(user);
        setStep('rewriting');
        break;
      case 'rewriting':
        onComplete(selectedUser);
        break;
    }
  };

  return (
    <>
      {step === 'loading' && (
        <Loading onComplete={() => handleStepComplete('loading')} />
      )}
      {step === 'testuser' && (
        <TestUserSelect
          onComplete={user => handleStepComplete('testuser', user)}
        />
      )}
      {step === 'rewriting' && (
        <UserReWriting
          user={selectedUser}
          onComplete={() => handleStepComplete('rewriting')}
        />
      )}
    </>
  );
};

export default OnboardingFlow;
