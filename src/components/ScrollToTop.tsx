import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Add animation class to main content
    const main = document.querySelector('main');
    if (main) {
      main.classList.remove('animate-page-in');
      // Trigger reflow to restart animation
      void main.offsetWidth;
      main.classList.add('animate-page-in');
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
