# SF Secret Menu

Chef-crafted meals delivered weekly to your door. San Francisco Bay Area.

## Live Site

**Production**: https://sfsecretmenu.github.io/sfsecretmenu/

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (Postgres + Auth + Realtime)
- **Payments**: Crypto (wagmi/viem) + Traditional (Stripe-ready)
- **3D**: Three.js + React Three Fiber
- **Deployment**: GitHub Pages + GitHub Actions CI/CD

## Features

- Weekly rotating chef menus
- Subscription meal plans (Essential, Standard, Premium)
- Gift cards and gift meal plans
- Referral program (1 free meal per friend signup)
- Order tracking with real-time updates
- Admin dashboard for order/customer/menu management
- Responsive design (mobile, tablet, desktop)
- Command palette (Cmd+K) for quick navigation

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run E2E tests
npm run test:e2e
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
```

## Deployment

Push to `main` branch triggers:
1. Lint + Build + E2E tests
2. Deploy to GitHub Pages (if tests pass)

GitHub Secrets required:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, Order)
├── data/           # Static data (plans, reviews, menus)
├── hooks/          # Custom React hooks
├── integrations/   # Supabase client + types
├── lib/            # Utilities (wagmi config, etc.)
└── pages/          # Route components
    └── admin/      # Admin dashboard pages
```

## License

Private - SF Secret Menu
