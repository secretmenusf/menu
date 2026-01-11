import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Configuration - Replace with actual IDs in production
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || 'XXXXXXXXXXXXXXX';
const TIKTOK_PIXEL_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID || '';

// Declare global types for analytics
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
    ttq: {
      track: (...args: unknown[]) => void;
      page: () => void;
      load: (id: string) => void;
    };
  }
}

// Initialize Google Analytics
const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID.startsWith('G-')) return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

// Initialize Facebook Pixel
const initFBPixel = () => {
  if (typeof window === 'undefined' || !FB_PIXEL_ID || FB_PIXEL_ID.includes('X')) return;

  // Facebook Pixel base code
  const f = window;
  const b = document;
  const e = 'script';

  if (f.fbq) return;

  const n = f.fbq = function (...args: unknown[]) {
    if ((n as unknown as { callMethod?: (...a: unknown[]) => void }).callMethod) {
      (n as unknown as { callMethod: (...a: unknown[]) => void }).callMethod(...args);
    } else {
      (n as unknown as { queue: unknown[] }).queue.push(args);
    }
  } as unknown as HTMLScriptElement;

  if (!f._fbq) f._fbq = n;
  (n as unknown as { push: (...args: unknown[]) => void; loaded: boolean; version: string; queue: unknown[]; callMethod?: (...args: unknown[]) => void }).loaded = true;
  (n as unknown as { version: string }).version = '2.0';
  (n as unknown as { queue: unknown[] }).queue = [];

  const t = b.createElement(e) as HTMLScriptElement;
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = b.getElementsByTagName(e)[0];
  s?.parentNode?.insertBefore(t, s);

  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
};

// Initialize TikTok Pixel
const initTikTokPixel = () => {
  if (typeof window === 'undefined' || !TIKTOK_PIXEL_ID) return;

  const script = document.createElement('script');
  script.innerHTML = `
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${TIKTOK_PIXEL_ID}');
      ttq.page();
    }(window, document, 'ttq');
  `;
  document.head.appendChild(script);
};

// Track page views
export const trackPageView = (path: string) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: path });
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  // TikTok
  if (window.ttq) {
    window.ttq.page();
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', eventName, params);
  }

  // TikTok
  if (window.ttq) {
    window.ttq.track(eventName, params);
  }
};

// E-commerce specific events
export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}) => {
  trackEvent('AddToCart', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: item.price,
    currency: 'USD',
    quantity: item.quantity || 1,
  });
};

export const trackPurchase = (order: {
  orderId: string;
  value: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) => {
  trackEvent('Purchase', {
    transaction_id: order.orderId,
    value: order.value,
    currency: 'USD',
    content_ids: order.items.map(i => i.id),
    contents: order.items.map(i => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
  });
};

export const trackSignUp = (method?: string) => {
  trackEvent('CompleteRegistration', {
    method: method || 'email',
  });
};

export const trackStartCheckout = (value: number, itemCount: number) => {
  trackEvent('InitiateCheckout', {
    value,
    currency: 'USD',
    num_items: itemCount,
  });
};

export const trackViewContent = (content: {
  id: string;
  name: string;
  category?: string;
  value?: number;
}) => {
  trackEvent('ViewContent', {
    content_ids: [content.id],
    content_name: content.name,
    content_category: content.category,
    value: content.value,
    currency: 'USD',
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('Search', {
    search_string: searchTerm,
  });
};

export const trackLead = (value?: number) => {
  trackEvent('Lead', {
    value: value || 0,
    currency: 'USD',
  });
};

// Analytics Provider Component
export const Analytics = () => {
  const location = useLocation();

  // Initialize analytics on mount
  useEffect(() => {
    initGA();
    initFBPixel();
    initTikTokPixel();
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default Analytics;
