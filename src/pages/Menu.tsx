import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeeklyMenuGrid from '@/components/WeeklyMenuGrid';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';

const Menu = () => {
  return (
    <div className="min-h-screen bg-[#f7f4f0] flex flex-col">
      <SEOHead
        {...pageSEO.menu}
        url="https://sfsecretmenu.com/menu"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://sfsecretmenu.com' },
          { name: 'Menu', url: 'https://sfsecretmenu.com/menu' },
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
