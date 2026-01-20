import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeeklyMenuGrid from '@/components/WeeklyMenuGrid';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';

const Menu = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col dark">
      <SEOHead
        {...pageSEO.menu}
        url="https://secretmenusf.com/menu"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://secretmenusf.com' },
          { name: 'Menu', url: 'https://secretmenusf.com/menu' },
        ])}
      />

      <Header />

      <main className="flex-1 pt-20">
        <WeeklyMenuGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
