import { Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { brand } from '../data/brand'
import { navSections } from '../data/navigation'

type Props = {
  children: ReactNode
  title?: string
}

export function AppShell({ children, title }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={`app-sidebar${open ? ' is-open' : ''}`}>
        <div className="app-sidebar__brand">
          <span className="app-sidebar__mark">{brand.shortName}</span>
          <span className="app-sidebar__sub">AI Recruitment</span>
        </div>

        <nav className="app-sidebar__nav" aria-label="Primary">
          {navSections.map((section) => (
            <div key={section.title} className="nav-section">
              <p className="nav-section__title">{section.title}</p>
              <ul>
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="icon-btn mobile-only"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <p className="app-topbar__title">{title ?? brand.name}</p>
        </header>
        <div className="app-content">{children}</div>
      </div>
    </div>
  )
}
