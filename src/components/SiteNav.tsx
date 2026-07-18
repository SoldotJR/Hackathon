import { NavLink } from 'react-router-dom'
import { brand } from '../data/brand'
import { mainNav } from '../data/navigation'

/** Compact top links kept for reuse; primary navigation lives in AppShell. */
export function SiteNav() {
  return (
    <header className="site-nav">
      <NavLink to="/" className="site-nav__brand" end>
        {brand.shortName}
      </NavLink>
      <nav className="site-nav__links" aria-label="Primary">
        {mainNav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
