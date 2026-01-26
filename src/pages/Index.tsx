import { useState, useEffect } from 'react';
import PasswordGate from '@/components/PasswordGate';
import Home from '@/pages/Home';

const Index = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const grantedAt = localStorage.getItem('secretmenu_access_at');
    if (grantedAt) {
      const elapsed = Date.now() - Number(grantedAt);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (elapsed < twentyFourHours) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem('secretmenu_access_at');
      }
    }
  }, []);

  const handleSuccess = () => {
    localStorage.setItem('secretmenu_access_at', String(Date.now()));
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <PasswordGate onSuccess={handleSuccess} />;
  }

  return <Home />;
};

export default Index;
