import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/sobre", label: "Sobre" },
  { to: "/solucao", label: "Solução" },
  { to: "/avatar", label: "Avatar" },
  { to: "/integrantes", label: "Integrantes" },
  { to: "/faq", label: "FAQ" },
  { to: "/contato", label: "Contato" },
];

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-forest/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <NavLink
            to="/"
            aria-label="Soul Up - página inicial"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 text-xl font-black tracking-tight text-white"
          >
            <img className="h-10 w-10 object-contain" src="/icon/souldup.png" alt="" />
            Soul <span className="text-leaf">Up</span>
          </NavLink>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-mint transition hover:border-leaf/60 hover:text-leaf md:hidden"
          >
            {menuOpen ? "Fechar" : "Menu"}
          </button>

          <nav
            id="main-navigation"
            className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 md:flex md:w-auto md:flex-row md:items-center md:gap-1`}
          >
            {navigation.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/solucao"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-leaf/10 text-leaf"
                      : "text-mint hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© 2026 — Nexus Elite · Soul Up</p>
          <p>Sustentabilidade, comunidade e ação coletiva.</p>
        </div>
      </footer>
    </div>
  );
}
