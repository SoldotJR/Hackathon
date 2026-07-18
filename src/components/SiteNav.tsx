import { NavLink } from 'react-router-dom'
import { brand } from '../data/brand'

export function SiteNav() {
  return (
    <header className="site-nav">
      <NavLink to="/" className="site-nav__brand" end>
        {brand.name}
      </NavLink>
      <nav className="site-nav__links" aria-label="Primary">
        <NavLink to="/" end>
          Agent
        </NavLink>
        <NavLink to="/recruitment">Recruitment</NavLink>
      </nav>
    </header>
  )
}
