# SF Secret Menu - LLM Context

> Chef-crafted meals delivered weekly to your door. San Francisco Bay Area.

**Live Site**: https://sfsecretmenu.github.io/sfsecretmenu/

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| State | React Context + TanStack Query + Zustand |
| Database | Supabase (Postgres + Auth + Realtime) |
| Payments | Stripe (subscriptions) + Square + Crypto (wagmi/viem) |
| 3D | Three.js + React Three Fiber |
| Testing | Playwright E2E |
| Deploy | GitHub Pages + GitHub Actions CI/CD |

## Project Structure

```
src/
├── components/       # React UI components
│   ├── admin/        # Admin dashboard controls
│   ├── auth/         # Login, Signup, ForgotPassword
│   ├── chat/         # AI ordering chat system
│   ├── delivery/     # Tracking, zone management
│   ├── order/        # Order creation/management
│   ├── payment/      # Stripe, Square, Crypto
│   ├── profile/      # User profile
│   ├── referral/     # Referral program
│   ├── subscription/ # Plan cards
│   ├── ui/           # Base Radix components
│   └── ...
├── contexts/         # AuthContext, OrderContext, SubscriptionContext
├── data/             # Static data (plans, menus, reviews)
├── hooks/            # useAuth, useOrders, useToast, etc.
├── integrations/     # Supabase client + types
├── lib/              # wagmi config, utils
├── pages/            # 44 route components
│   └── admin/        # 10 admin pages
├── services/         # hanzoGateway, stripeService, emailService
└── config/           # App configuration
```

## Key Contexts

### AuthContext
- `session`, `user`, `profile` - Auth state
- `signUp`, `signIn`, `signOut` - Auth methods
- `signInWithMagicLink` - Passwordless OTP
- Profile includes dietary preferences, referral code

### OrderContext
- `cart` - Current shopping cart
- `currentOrder`, `orderHistory` - Orders
- Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART

### SubscriptionContext
- `subscription`, `plan` - User's subscription
- Feature flags: `canViewSecretMenu`, `canOrderDelivery`, `canAccessChefAI`
- `creditsRemaining`, `deliveryFee`

## Routing

**Public**: `/`, `/menu`, `/product/:id`, `/pricing`, `/checkout`, `/login`, `/signup`

**Protected** (require auth): `/profile`, `/addresses`, `/my-orders`, `/orders/:orderId`

**Admin** (require admin role): `/admin/*` - Dashboard, Orders, Customers, Deliveries, Menus, Payments, Settings

## Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| `profiles` | User account, dietary preferences |
| `organizations` | B2B customer accounts |
| `organization_members` | Team roles (owner/admin/member) |
| `addresses` | Delivery addresses |
| `subscriptions` | Active subscription state |
| `orders` | Order records with status |
| `menu_weeks` | Weekly menu definitions |
| `menu_items` | Meals with nutrition |
| `referrals` | Referral tracking |
| `user_roles` | Admin/special roles |

## Subscription Tiers

| Tier | Price | Credits | Features |
|------|-------|---------|----------|
| Access | $29/mo | 100 AI | Basic menu access |
| Plus | $79/mo | $35 + 200 AI | Delivery + customize (POPULAR) |
| Solo Dev | $399/mo | $350 + 400 AI | Free delivery, archives |
| Hacker House | $999/mo | $900 + 800 AI | Unlimited members |

## Payment Integrations

- **Stripe**: Subscriptions, checkout sessions, customer portal
- **Square**: One-time meal payments
- **Crypto**: USDC/USDT on Mainnet + Base via wagmi

## AI Chat Integration

- Hanzo Gateway at `https://gateway.hanzo.ai`
- Model: `llama3.3-70b-instruct`
- Streaming chat completions
- Handoff to email support

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 5173)
npm run build      # Build for production
npm run test:e2e   # Run Playwright tests
```

## Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_SQUARE_APPLICATION_ID=
VITE_SQUARE_LOCATION_ID=
```

## Architectural Patterns

1. **Lazy Loading**: Pages lazy-loaded via React.lazy + Suspense
2. **Type Safety**: Full TypeScript with Zod validation
3. **Dark Mode**: next-themes with class strategy
4. **Responsive**: TailwindCSS mobile-first
5. **Accessibility**: Radix UI components (WCAG compliant)
6. **SEO**: React Helmet for dynamic head management

## Key Files Reference

- `src/App.tsx` - Main router + provider stack
- `src/main.tsx` - React entry point
- `src/contexts/AuthContext.tsx` - Authentication
- `src/contexts/OrderContext.tsx` - Shopping cart
- `src/contexts/SubscriptionContext.tsx` - Subscriptions
- `src/integrations/supabase/client.ts` - Supabase client
- `src/services/stripeService.ts` - Stripe integration
- `src/data/plans.ts` - Subscription plan definitions
- `src/data/menus.ts` - Menu data (79KB)

---
*Last updated: 2026-01-28*
