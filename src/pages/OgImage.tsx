// OG Image generator page - renders a nice preview of the weekly menu
// This page is screenshotted by GitHub Actions every Wednesday to create og-weekly.png

const weeklyMenu = [
  { day: 'Mon', lunch: 'Grass-Fed Beef Empanadas', dinner: 'Pepper Steak Stir-Fry', lunchImg: '/menu-empanadas.png', dinnerImg: '/menu-pepper-steak.png' },
  { day: 'Tue', lunch: 'Beef Cheek Quesadillas', dinner: 'Salmon & Crispy Potatoes', lunchImg: '/menu-quesadillas.png', dinnerImg: '/menu-salmon-potatoes.png' },
  { day: 'Wed', lunch: 'Spring Chicken', dinner: "Mom's Meatloaf", lunchImg: '/menu-spring-chicken.png', dinnerImg: '/menu-meatloaf.png' },
  { day: 'Thu', lunch: 'Chicken Cordon Bleu', dinner: 'Steak Salad', lunchImg: '/menu-cordon-bleu.png', dinnerImg: '/menu-steak-salad.png' },
  { day: 'Fri', lunch: '4-Cheese Truffle Gnocchi', dinner: 'Beef Ragu Lasagne', lunchImg: '/menu-gnocchi.png', dinnerImg: '/menu-lasagne.png' },
];

const OgImage = () => {
  return (
    <div
      id="og-capture"
      style={{
        width: 1200,
        height: 630,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        padding: 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: '0.1em' }}>
            SECRET MENU
          </h1>
          <p style={{ fontSize: 14, color: '#888', margin: '4px 0 0', letterSpacing: '0.2em' }}>
            SF BAY AREA
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 20, fontWeight: 600, margin: 0, color: '#10b981' }}>
            Next Week's Menu
          </p>
          <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>
            Order by Thursday • Delivered Twice Weekly
          </p>
        </div>
      </div>

      {/* Menu Grid - 5 days, 2 meals each */}
      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        {weeklyMenu.map((day) => (
          <div
            key={day.day}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#10b981',
              marginBottom: 8,
              textAlign: 'center',
              borderBottom: '1px solid rgba(16,185,129,0.3)',
              paddingBottom: 6
            }}>
              {day.day}
            </div>

            {/* Lunch */}
            <div style={{ flex: 1, marginBottom: 8 }}>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#222',
                marginBottom: 6
              }}>
                <img
                  src={day.lunchImg}
                  alt={day.lunch}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p style={{ fontSize: 10, color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lunch</p>
              <p style={{ fontSize: 11, color: '#fff', margin: '2px 0 0', fontWeight: 500, lineHeight: 1.2 }}>{day.lunch}</p>
            </div>

            {/* Dinner */}
            <div style={{ flex: 1 }}>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#222',
                marginBottom: 6
              }}>
                <img
                  src={day.dinnerImg}
                  alt={day.dinner}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p style={{ fontSize: 10, color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dinner</p>
              <p style={{ fontSize: 11, color: '#fff', margin: '2px 0 0', fontWeight: 500, lineHeight: 1.2 }}>{day.dinner}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
          secretmenusf.com/weekly
        </p>
        <p style={{ fontSize: 12, color: '#10b981', margin: 0, fontWeight: 600 }}>
          10 Chef-Prepared Meals • Mon-Fri
        </p>
      </div>
    </div>
  );
};

export default OgImage;
