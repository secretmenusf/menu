import { Link } from 'react-router-dom';
import { Leaf, Sprout, HeartHandshake, MapPin, Sparkles, CookingPot } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const galleryImages = [
  '0a80ba4e623eaa8e596dba76de89e4fe.avif',
  '628753905.jpg',
  'a-colorful-display-of-fresh-ingredients-for-healthier-meals-on-a-gray-background-photo.jpeg',
  'Barebones+x+SXSW+-+Field+and+Fire+-+Caroline+Hargraves+Photography+-+Ardor+Wood+Farm+-+March+2019-440-Caroline+Hargraves+Photography.jpg.webp',
  'biodynamic-med-herbfarm.jpg',
  'c7236d65-31_history-fam-table-movement_01-hero.jpg',
  'Cocoa_Pods.JPG',
  'Four_Types_Of_Cinnamon.jpg.webp',
  'img_20190607_100442706_hdr_1.jpg.webp',
  'lemongrass-1.avif',
  'lionsmane.png',
  'massive-turmeric-root-1080x1080.png.webp',
  'medium_c1cea3e5_d68d_4d47_a05d_eec7098bc238_istock_master1305_527631473_0ee839c579.jpg',
  'medium_fe55034e_74b1_4a07_8fbe_ec2debafc133_plantsguru_com_medicinal_plants_acmella_800x800_b8fc25655f.jpg',
  'meraki-meadows-saffron.jpg',
  'photo-3-elba-farm.jpeg',
  'regenerative_herb_farm_row_with_solar_panels_for_water_pumps.webp',
  'Rochelle-Bilow.Photo-by-Anthony-Aquino..jpg.webp',
  'SummerTimes-Lavender-Farms-New-Life_crLauraMcReynolds-06052025.jpg',
  'thai-farm-chiang-mai-cooking-6.jpg',
  'what-does-farm-to-table-mean.jpg.webp',
];

const ZooNgo = () => {
  const imageUrl = (filename: string) => encodeURI(`/zoo-ngo/${filename}`);

  const heroImage = 'healingfarm.jpg';
  const farmImage = 'nourish.jpg.webp';
  const herbImage = galleryImages[15];
  const mushroomImage = galleryImages[10];
  const cookingImage = galleryImages[19];
  const ingredientsImage = galleryImages[2];

  const imageRail = [
    galleryImages[0],
    galleryImages[14],
    galleryImages[17],
    galleryImages[20],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28 pb-28 space-y-24">
        <section
          className="relative overflow-hidden"
          style={{ backgroundImage: `url(${imageUrl(heroImage)})` }}
        >
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]" />

          <div className="container mx-auto px-6 max-w-6xl relative">
            <div className="min-h-[560px] md:min-h-[640px] flex items-center">
              <div className="max-w-2xl space-y-8 text-white">
                <p className="font-display text-xs tracking-[0.5em] text-white/80">SECRET MENU x ZOO NGO</p>
                <h1 className="font-display font-semibold text-4xl md:text-6xl tracking-[0.12em] text-white">
                  REGENERATIVE HEALING FARM
                </h1>
                <p className="font-body text-lg md:text-xl text-white/80 leading-relaxed">
                  Zoo NGO is launching a regenerative healing farm to grow nutrient-dense and medicinal foods,
                  restore ecosystems, and expand real food access for underserved communities.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-white/90">
                    <Link to="/contact">Partner with Zoo NGO</Link>
                  </Button>
                  <Button asChild size="lg" className="group relative overflow-hidden rounded-full bg-black/80 text-white hover:text-black">
                    <Link to="/donate" className="relative isolate px-1">
                      <span className="absolute inset-0 -z-10 translate-x-[-110%] bg-gradient-to-r from-amber-200 via-emerald-200 to-sky-200 transition-transform duration-200 group-hover:translate-x-0" />
                      <span className="relative">Donate</span>
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-white/70">
                  100% tax deductible via The Zoolabs Foundation (501(c)(3)). EIN #883538992.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <MapPin className="h-4 w-4" />
                  <span className="font-body">The Zoolabs Foundation • San Francisco, California</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="p-8 rounded-[28px] border border-border bg-card/30 space-y-4 my-12">
              <Leaf className="h-8 w-8 text-emerald-400" />
              <h3 className="font-display text-lg tracking-[0.12em]">ACCESS</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Delivering fresh, nourishing meals and making real food affordable and accessible to all people.
              </p>
            </div>
            <div className="p-8 rounded-[28px] border border-border bg-card/30 space-y-4 my-12">
              <Sprout className="h-8 w-8 text-amber-400" />
              <h3 className="font-display text-lg tracking-[0.12em]">THE FARM</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Land acquisition for a permanent healing farm cultivating medicinal mushrooms, adaptogenic herbs,
                rare spices, and nutrient-dense vegetables.
              </p>
            </div>
            <div className="p-8 rounded-[28px] border border-border bg-card/30 space-y-4 my-12">
              <HeartHandshake className="h-8 w-8 text-sky-400" />
              <h3 className="font-display text-lg tracking-[0.12em]">COMMUNITY</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Education and outreach that teach holistic diet, gardening, and self-sustaining food practices.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
            <div className="rounded-[32px] overflow-hidden border border-border bg-card/20">
              <img
                src={imageUrl(farmImage)}
                alt="Regenerative herb farm rows"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-6">
              <p className="font-display text-xs tracking-[0.4em] text-muted-foreground">MISSION</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.12em]">NOURISHMENT AS A HUMAN RIGHT</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Zoo NGO is building the ZooLabs Sanctuary & Regenerative Healing Farm to produce nutrient-dense and
                medicinal foods, restore ecosystems, and expand food sovereignty for underserved households.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                The farm’s crops support longevity, immune resilience, and whole-body wellness while being grown
                using regenerative practices that rebuild soil and protect biodiversity.
              </p>
              <div className="rounded-[24px] border border-border bg-card/30 p-6 space-y-3 my-12">
                <div className="flex items-center gap-3 text-black">
                  <Sparkles className="h-5 w-5" />
                  <p className="font-display text-xs tracking-[0.25em]">PROJECT FOCUS</p>
                </div>
                <div className="space-y-3 font-body text-sm text-muted-foreground">
                  <p>Secure and steward land for permanent healing farm operations.</p>
                  <p>Grow medicinal mushrooms, adaptogenic herbs, rare spices, and nutrient-dense vegetables.</p>
                  <p>Distribute food through meal partnerships serving food-insecure households.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
            <div className="space-y-6">
              <p className="font-display text-xs tracking-[0.4em] text-muted-foreground">CHEF PARTNERSHIP</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.12em]">SECRET MENU CHEFS, SERVING ALL</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                SF Secret Menu donates chef time to prepare healthy, healing, and medicinal meals for community
                distribution, ensuring real food reaches people who need it most.
              </p>
              <div className="grid sm:grid-cols-2 gap-12">
                <div className="rounded-[20px] border border-border bg-card/30 p-6 space-y-3 my-12">
                  <p className="font-display text-sm tracking-[0.2em]">MEAL ACCESS</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Partnerships with local organizations allow us to serve food-insecure families with consistent,
                    nutrient-dense meals.
                  </p>
                </div>
                <div className="rounded-[20px] border border-border bg-card/30 p-6 space-y-3 my-12">
                  <p className="font-display text-sm tracking-[0.2em]">HEALING CUISINE</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Menus emphasize medicinal ingredients and restorative cooking techniques inspired by holistic
                    traditions.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-border bg-card/20">
              <img
                src={imageUrl(cookingImage)}
                alt="Cooking and food preparation"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
            <div className="rounded-[32px] overflow-hidden border border-border bg-card/20">
              <img
                src={imageUrl(herbImage)}
                alt="Herbs and healing crops"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-6">
              <p className="font-display text-xs tracking-[0.4em] text-muted-foreground">EDUCATION</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.12em]">COMMUNITY-LED LEARNING</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Practical workshops on nutrient-dense cooking, herbal foods, and longevity-focused diets that are
                culturally grounded and community-led.
              </p>
              <div className="grid sm:grid-cols-2 gap-12">
                <div className="rounded-[20px] border border-border bg-card/30 p-6 space-y-3 my-12">
                  <div className="flex items-center gap-2 text-black">
                    <CookingPot className="h-4 w-4" />
                    <p className="font-display text-sm tracking-[0.2em]">FOOD LITERACY</p>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Hands-on guidance for families to cook healing meals and integrate medicinal foods.
                  </p>
                </div>
                <div className="rounded-[20px] border border-border bg-card/30 p-6 space-y-3 my-12">
                  <div className="flex items-center gap-2 text-black">
                    <Sprout className="h-4 w-4" />
                    <p className="font-display text-sm tracking-[0.2em]">SELF-SUSTAINABLE FARMING</p>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Teaching neighbors to plant, steward soil, and grow their own food for long-term resilience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl">
          <div className="rounded-[36px] border border-border bg-card/20 p-10 md:p-12 space-y-10">
            <div className="space-y-3">
              <p className="font-display text-xs tracking-[0.4em] text-muted-foreground">THE REGENERATIVE VISION</p>
              <h3 className="font-display text-2xl md:text-3xl tracking-[0.12em]">FIELD TO HEALING TABLE</h3>
              <p className="font-body text-muted-foreground max-w-3xl leading-relaxed">
                A visual look at the ingredients, farms, and regenerative practices inspiring the Zoo NGO mission.
                These images reflect the healing foods, medicinal herbs, and community-centered growing practices we
                are building together.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-[24px] overflow-hidden border border-border bg-card/20 aspect-[4/3]">
                <img
                  src={imageUrl(ingredientsImage)}
                  alt="Fresh ingredients"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="rounded-[24px] overflow-hidden border border-border bg-card/20 aspect-[4/3]">
                <img
                  src={imageUrl(mushroomImage)}
                  alt="Medicinal mushrooms"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {imageRail.map((filename) => (
                <div key={filename} className="rounded-[24px] overflow-hidden border border-border bg-card/20 aspect-square">
                  <img
                    src={imageUrl(filename)}
                    alt={filename.replace(/\.[^/.]+$/, '').replace(/[-_+]+/g, ' ').replace(/\s+/g, ' ').trim()}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.14em]">JOIN THE MOVEMENT</h2>
              <p className="font-body text-muted-foreground max-w-2xl leading-relaxed">
                Support land acquisition, chef-led meal distribution, and community education. Together we can make
                fresh food a shared standard and help the next generation thrive.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="rounded-full bg-amber-500/20 text-black hover:bg-amber-500/30 border border-amber-500/40">
                  <a href="mailto:hello@zoo.ngo?subject=Volunteer%20opportunities">Volunteer or Collaborate</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-foreground/20">
                  <Link to="/donate">Donate or Sponsor</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/images/mangosteam.png"
                alt="Seed of Life — Mangosteen"
                className="w-48 h-48 object-contain opacity-70"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ZooNgo;
