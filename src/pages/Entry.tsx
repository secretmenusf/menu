import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Entry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has access, if not redirect to login which will show password gate
    const access = sessionStorage.getItem('secretmenu_access');
    if (access !== 'true') {
      navigate('/login', { replace: true });
    } else {
      navigate('/order', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-body text-sm text-muted-foreground">Authenticating...</p>
    </div>
  );
};

export default Entry;
