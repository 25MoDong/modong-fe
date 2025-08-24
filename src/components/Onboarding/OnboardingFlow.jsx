import { useState } from 'react';
import TestUserSelect from './TestUserSelect';
import Redefinition from './Redefinition';

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
        <Redefinition
          onComplete={() => handleStepComplete('rewriting')}
          fromOnboarding={true}
        />
      )}
    </>
  );
};

export default OnboardingFlow;
