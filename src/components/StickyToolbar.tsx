import { Moon, Sun, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/components/theme-provider'

export function StickyToolbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-lg"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </button>

      {/* About link */}
      <Link
        to="/about"
        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-lg"
        title="About"
      >
        <Info size={18} />
      </Link>
    </div>
  )
}

export default StickyToolbar
