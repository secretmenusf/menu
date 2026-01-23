import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Order page now redirects to pricing
 * All subscription management happens through the pricing page
 */
const Order = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to pricing page
    navigate('/pricing', { replace: true });
  }, [navigate]);

  return null;
};

export default Order;
