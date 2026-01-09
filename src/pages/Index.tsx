import { useState, useEffect } from 'react';
import PasswordGate from '@/components/PasswordGate';
import Home from '@/pages/Home';

const Index = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has already passed the gate
    const hasAccess = sessionStorage.getItem('secretmenu_access');
    if (hasAccess === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSuccess = () => {
    sessionStorage.setItem('secretmenu_access', 'true');
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <PasswordGate onSuccess={handleSuccess} />;
  }

  return <Home />;
};

export default Index;
