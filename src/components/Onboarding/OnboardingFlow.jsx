import { useState } from 'react';
import TestUserSelect from './TestUserSelect';
import UserReWriting from './UserReWriting';

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState('testuser');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleStepComplete = (step, user) => {
    switch (step) {
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
