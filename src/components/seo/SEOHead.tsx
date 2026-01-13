import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  schema?: object;
}

const defaultMeta = {
  title: 'SF Secret Menu | Premium Organic Meal Delivery in San Francisco',
  description: 'Chef-crafted organic meals delivered fresh daily. 100% organic, locally-sourced ingredients. Healing food as medicine. Bay Area\'s premier private chef experience.',
  keywords: 'meal delivery san francisco, organic meal delivery, private chef sf, healthy meal prep, luxury meal service, bay area food delivery, farm to table delivery',
  image: 'https://sfsecretmenu.com/og-image.png',
  url: 'https://sfsecretmenu.com',
};

// Page-specific SEO configurations
export const pageSEO: Record<string, SEOHeadProps> = {
  home: {
    title: 'SF Secret Menu | Premium Organic Meal Delivery San Francisco',
    description: 'San Francisco\'s premier private chef experience. 100% organic, locally-sourced meals delivered fresh daily. Nourishing body, mind, and soul. Join the Bay Area\'s most exclusive meal service.',
    keywords: 'meal delivery san francisco, organic meal delivery sf, private chef bay area, healthy meal prep, luxury meal service, farm to table delivery, chef prepared meals',
  },
  menu: {
    title: 'Weekly Menu | SF Secret Menu',
    description: 'Explore this week\'s chef-crafted organic menu. Mediterranean-inspired dishes, farm-fresh ingredients, delivered fresh daily. View our rotating seasonal selections.',
    keywords: 'weekly meal menu, organic dinner delivery, chef menu san francisco, mediterranean cuisine, seasonal menu',
  },
  order: {
    title: 'Order Meals | SF Secret Menu',
    description: 'Start your culinary journey. Choose from Essential, Standard, or Premium meal plans. Flexible scheduling, same-day delivery available. 100% organic, chef-prepared meals.',
    keywords: 'order meals san francisco, meal subscription sf, organic meal plan, healthy food delivery, weekly meal delivery',
  },
  pricing: {
    title: 'Pricing & Plans | SF Secret Menu',
    description: 'Choose your perfect meal plan from $395/month. Essential (3 meals/week), Standard (5 meals/week), or Premium (7 meals/week). All plans include organic ingredients and free delivery.',
    keywords: 'meal plan pricing, organic meal subscription cost, private chef pricing, weekly meal delivery cost',
  },
  compare: {
    title: 'Compare Meal Services | SF Secret Menu vs Competitors',
    description: 'See how SF Secret Menu compares to HelloFresh, Factor, Sakara, and other meal services. 100% organic, chef-prepared, never frozen. The premium alternative to meal kits.',
    keywords: 'meal delivery comparison, hellofresh alternative, factor alternative, best meal delivery san francisco, organic vs meal kits',
  },
  chef: {
    title: 'Meet Chef Antje | SF Secret Menu',
    description: 'Meet Chef Antje, the culinary alchemist behind SF Secret Menu. Trained in European kitchens, specializing in healing Mediterranean cuisine with organic, locally-sourced ingredients.',
    keywords: 'private chef san francisco, chef antje, culinary alchemist, personal chef bay area',
  },
  reviews: {
    title: 'Customer Reviews | SF Secret Menu',
    description: 'Read reviews from San Francisco\'s most discerning food lovers. 4.9★ rating. See why customers switched from meal kits and delivery apps to SF Secret Menu.',
    keywords: 'sf secret menu reviews, meal delivery reviews, customer testimonials, organic meal delivery reviews',
  },
  about: {
    title: 'About Us | SF Secret Menu',
    description: 'The story behind SF Secret Menu. Our mission to nourish San Francisco with organic, locally-sourced, chef-crafted meals. Food as medicine, food as art.',
    keywords: 'about sf secret menu, organic meal company, san francisco food delivery company',
  },
  support: {
    title: 'Help & Support | SF Secret Menu',
    description: 'Get help with your SF Secret Menu orders. Contact our team, view FAQs, manage your subscription. We\'re here to support your culinary journey.',
    keywords: 'sf secret menu support, meal delivery help, contact sf secret menu',
  },
  'gift-cards': {
    title: 'Gift Cards | SF Secret Menu',
    description: 'Give the gift of nourishment. SF Secret Menu gift cards for organic, chef-prepared meals. Perfect for foodies, wellness enthusiasts, and busy professionals.',
    keywords: 'meal delivery gift card, organic food gift, san francisco food gift, chef meal gift',
  },
  login: {
    title: 'Sign In | SF Secret Menu',
    description: 'Sign in to manage your SF Secret Menu subscription, view orders, and customize your meal preferences.',
  },
  signup: {
    title: 'Join SF Secret Menu | Create Account',
    description: 'Join San Francisco\'s most exclusive meal delivery service. Start your culinary journey with organic, chef-crafted meals delivered to your door.',
    keywords: 'join sf secret menu, meal delivery signup, organic meal subscription',
  },
};

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
  schema,
}: SEOHeadProps) {
  const seoTitle = title || defaultMeta.title;
  const seoDescription = description || defaultMeta.description;
  const seoKeywords = keywords || defaultMeta.keywords;
  const seoImage = image || defaultMeta.image;
  const seoUrl = url || defaultMeta.url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Canonical */}
      <link rel="canonical" href={seoUrl} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

// Common schemas
export const schemas = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SF Secret Menu',
    url: 'https://sfsecretmenu.com',
    logo: 'https://sfsecretmenu.com/logo.svg',
    sameAs: [
      'https://instagram.com/sfsecretmenu',
      'https://x.com/sfsecretmenu',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-415-373-2496',
      contactType: 'customer service',
      areaServed: 'San Francisco Bay Area',
      availableLanguage: 'English',
    },
  },
  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'FoodService',
    name: 'SF Secret Menu',
    description: 'Premium organic meal delivery service in San Francisco',
    url: 'https://sfsecretmenu.com',
    telephone: '+1-415-373-2496',
    email: 'hello@sfsecretmenu.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    priceRange: '$$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '01:00',
    },
  },
  breadcrumb: (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
  faqPage: (faqs: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),
};

export default SEOHead;
