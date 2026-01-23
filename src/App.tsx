import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { HelmetProvider } from 'react-helmet-async';
import { config } from '@/lib/wagmi';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeTransition } from '@/components/ThemeTransition';
import { Suspense, lazy, ReactNode } from 'react';

// Core pages (eager loaded)
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const Chef = lazy(() => import("./pages/Chef"));
const Entry = lazy(() => import("./pages/Entry"));
const About = lazy(() => import("./pages/About"));
const Brand = lazy(() => import("./pages/Brand"));
const Press = lazy(() => import("./pages/Press"));
const Contact = lazy(() => import("./pages/Contact"));
const Support = lazy(() => import("./pages/Support"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Compare = lazy(() => import("./pages/Compare"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const GiftMealPlan = lazy(() => import("./pages/GiftMealPlan"));
const Global = lazy(() => import("./pages/Global"));
const Invite = lazy(() => import("./pages/Invite"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const Addresses = lazy(() => import("./pages/Addresses"));
const Settings = lazy(() => import("./pages/Settings"));
const Preferences = lazy(() => import("./pages/Preferences"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Referrals = lazy(() => import("./pages/Referrals"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminOrganizations = lazy(() => import("./pages/admin/Organizations"));
const AdminInvoices = lazy(() => import("./pages/admin/Invoices"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminDeliveries = lazy(() => import("./pages/admin/Deliveries"));
const AdminMenus = lazy(() => import("./pages/admin/Menus"));
const AdminPayments = lazy(() => import("./pages/admin/Payments"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

// Admin Layout
import { AdminLayout } from '@/components/admin/AdminLayout';
import CommandPalette from '@/components/CommandPalette';
import Analytics from '@/components/Analytics';
import { EnhancedOrderingChat } from '@/components/chat/EnhancedOrderingChat';
import { MobileStickyCTA } from '@/components/MobileStickyCTA';
import ScrollToTop from '@/components/ScrollToTop';

const queryClient = new QueryClient();

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="font-display text-xs tracking-[0.3em] text-muted-foreground">LOADING</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// Admin route wrapper - uses AdminGuard for proper role checking
import { AdminGuard } from '@/components/admin/AdminGuard';
const AdminRoute = ({ children }: { children: ReactNode }) => {
  return <AdminGuard>{children}</AdminGuard>;
};

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/chef" element={<Chef />} />
      <Route path="/entry" element={<Entry />} />
      <Route path="/order" element={<Order />} />
      <Route path="/about" element={<About />} />
      <Route path="/brand" element={<Brand />} />
      <Route path="/press" element={<Press />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/join" element={<Navigate to="/pricing" replace />} />
      <Route path="/support" element={<Support />} />
      <Route path="/supprt" element={<Navigate to="/support" replace />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/gift-cards" element={<GiftCards />} />
      <Route path="/gift-meal-plan" element={<GiftMealPlan />} />
      <Route path="/global" element={<Global />} />
      <Route path="/invite" element={<Invite />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Protected user routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
      <Route path="/profile/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
      <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
      <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="organizations" element={<AdminOrganizations />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="deliveries" element={<AdminDeliveries />} />
        <Route path="menus" element={<AdminMenus />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <HelmetProvider>
    <ThemeProvider defaultTheme="dark" storageKey="sfsecretmenu-ui-theme">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SubscriptionProvider>
              <OrderProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
                <ThemeTransition>
                  <BrowserRouter>
                    <ScrollToTop />
                    <Analytics />
                    <CommandPalette />
                    <EnhancedOrderingChat />
                    <MobileStickyCTA />
                    <AppRoutes />
                  </BrowserRouter>
                </ThemeTransition>
              </TooltipProvider>
              </OrderProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
