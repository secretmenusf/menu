import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Entry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/order', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-body text-sm text-muted-foreground">Redirecting to order...</p>
    </div>
  );
};

export default Entry;
