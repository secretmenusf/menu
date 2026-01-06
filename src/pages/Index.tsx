import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordGate from '@/components/PasswordGate';

const Index = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (authenticated) {
      // Redirect to menu after successful auth
      navigate('/menu');
    }
  }, [authenticated, navigate]);

  if (!authenticated) {
    return <PasswordGate onSuccess={handleSuccess} />;
  }

  return null;
};

export default Index;
