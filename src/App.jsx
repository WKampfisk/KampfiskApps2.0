import React, { useState, useMemo } from 'react'
import {
  Search, X, ExternalLink, Github, Star, ArrowRight,
  Shield, Download, HeartHandshake, BadgeCheck, ShoppingCart
} from 'lucide-react'
import { apps, categories } from './data/apps'

const NAV = [
  { id: 'hjem', label: 'Hjem', href: '#' },
  { id: 'apps', label: 'Apper', href: '#apps' },
  { id: 'kategorier', label: 'Kategorier', href: '#kategorier' },
  { id: 'om', label: 'Om oss', href: '#om' },
  { id: 'hjelp', label: 'Hjelp', href: '#hjelp' },
]

const TRUST = [
  { icon: Shield, title: 'Trygg handel', sub: 'Sikker betaling med Stripe' },
  { icon: Download, title: 'Direkte levering', sub: 'Last ned umiddelbart' },
  { icon: HeartHandshake, title: 'Kundetilfredshet', sub: 'Vi er her for å hjelpe' },
  { icon: BadgeCheck, title: 'Høy kvalitet', sub: 'Kun utvalgte apper' },
]

function BrandMark({ className = 'h-9' }) {
  return (
    <a href="#" className={`flex items-center gap-2.5 group ${className}`}>
      <img
        src="/brand/logo-icon.png"
        alt="KampfiskApps"
        className="h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
      />
      <div className="leading-none">
        <span className="font-bold text-lg tracking-tight text-white">Kampfisk</span>
        <span className="font-bold text-lg tracking-tight text-rose-500">Apps</span>
      </div>
    </a>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedApp, setSelectedApp] = useState(null)
  const [sortMode, setSortMode] = useState('featured')

  const filteredApps = useMemo(() => {
    let result = [...apps]
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(app =>
        app.name.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        (app.tags && app.tags.join(' ').toLowerCase().includes(q))
      )
    }
    if (activeCategory !== 'All') {
      result = result.filter(app => app.category === activeCategory)
    }
    if (sortMode === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortMode === 'category') result.sort((a, b) => a.category.localeCompare(b.category))
    return result
  }, [searchTerm, activeCategory, sortMode])

  const featured = apps.slice(0, 4)

  const openApp = (app) => {
    setSelectedApp(app)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedApp(null)
    document.body.style.overflow = 'unset'
  }

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && selectedApp) closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedApp])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#050b16] text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#050b16]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          <BrandMark />

          <div className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={n.href}
                onClick={(e) => {
                  if (n.href.startsWith('#')) {
                    e.preventDefault()
                    if (n.href === '#') window.scrollTo({ top: 0, behavior: 'smooth' })
                    else scrollTo(n.href.slice(1))
                  }
                }}
                className="px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                {n.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition" aria-label="Handlekurv">
              <ShoppingCart size={18} />
            </button>
            <a
              href="https://github.com/WKampfisk"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-white transition"
            >
              <Github size={16} /> GitHub
            </a>
            <button className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-[#04101f] font-semibold text-sm px-4 py-2 rounded-xl transition shadow-[0_0_24px_rgba(34,211,238,0.25)]">
              Logg inn
            </button>
            <span className="hidden lg:inline text-lg" title="Norsk">🇳🇴</span>
          </div>
        </div>
      </nav>

      {/* Hero — matches layout webstore reference */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-14 sm:pb-20 grid lg:grid-cols-2 gap-10 items-center relative">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.08] text-white">
              Oppdag. Kjøp.<br />
              Bruk. <span className="text-rose-500">Kampfisk.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-400 max-w-md leading-relaxed">
              Kvalitetsapper og digitale produkter laget for deg.
            </p>

            <div className="mt-7 relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="search"
                placeholder="Søk etter apper eller produkter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => scrollTo('apps')}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 pl-11 pr-4 py-3.5 rounded-2xl text-sm placeholder:text-slate-500 outline-none transition"
              />
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => scrollTo('apps')}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition shadow-[0_8px_30px_rgba(244,63,94,0.3)]"
              >
                Utforsk apper
              </button>
              <button
                onClick={() => scrollTo('kategorier')}
                className="border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 font-semibold px-6 py-3 rounded-xl transition"
              >
                Se kategorier
              </button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute w-[70%] h-[70%] rounded-full bg-cyan-500/15 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <img
              src="/brand/hero-betta.png"
              alt="Kampfisk — betta mascot"
              className="relative z-10 w-full max-w-xl object-contain drop-shadow-[0_20px_60px_rgba(6,182,212,0.35)] select-none"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="border-b border-white/5 bg-[#070f1c]/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured apps */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-12 sm:pt-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Utvalgte apper</h2>
          <button onClick={() => scrollTo('apps')} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Se alle <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => openApp(app)}
              className="text-left group rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:border-cyan-500/30 p-5 transition shadow-lg shadow-black/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white mb-4">
                {app.iconLabel || app.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="font-semibold text-white group-hover:text-cyan-200 transition">{app.name}</div>
              <div className="text-xs text-slate-500 mt-1 line-clamp-1">{app.categoryNo || app.category}</div>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-400">
                <Star size={12} fill="currentColor" />
                <span>{app.rating || '4.6'}</span>
                <span className="text-slate-600">({app.reviews || 24})</span>
              </div>
              <div className="mt-3 text-sm font-semibold text-white">{app.priceNo || app.price}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="kategorier" className="max-w-7xl mx-auto px-5 sm:px-6 pt-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Kategorier</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                scrollTo('apps')
              }}
              className={`px-4 py-2 text-sm rounded-xl border transition ${
                activeCategory === cat
                  ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                  : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'Alle kategorier' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Full catalog */}
      <section id="apps" className="max-w-7xl mx-auto px-5 sm:px-6 pt-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Alle apper</h2>
            <p className="text-slate-500 mt-1 text-sm">Oppdag verktøy bygget for ekte behov</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Søk i katalogen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 pl-11 pr-4 py-2.5 rounded-2xl text-sm placeholder:text-slate-500 outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-3 text-slate-500 hover:text-slate-300">
                  <X size={18} />
                </button>
              )}
            </div>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="bg-white/5 border border-white/10 text-sm rounded-2xl px-4 py-2.5 outline-none cursor-pointer"
            >
              <option value="featured">Utvalgte</option>
              <option value="name">A — Å</option>
              <option value="category">Kategori</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 mb-4">
          Viser {filteredApps.length} av {apps.length} apper
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => openApp(app)}
                className="app-card group bg-[#0a1424] border border-white/8 hover:border-cyan-500/30 rounded-3xl overflow-hidden cursor-pointer flex flex-col"
              >
                <div className="relative h-44 bg-[#0d1b30] overflow-hidden">
                  <img
                    src={app.image}
                    alt={app.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = '/brand/hero-betta.png' }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/70 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur">
                      {app.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs px-3 py-1 bg-white/90 text-slate-900 rounded-2xl font-medium tracking-tight">
                      {app.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-semibold text-xl tracking-tight mb-1 text-white group-hover:text-cyan-200 transition">
                    {app.name}
                  </div>
                  <div className="text-slate-400 text-sm leading-snug line-clamp-2 mb-4">
                    {app.tagline}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <div className="font-medium text-cyan-400">{app.priceNo || app.price}</div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-300">
                      Detaljer <ArrowRight size={15} className="group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-400">Ingen apper matcher søket.</p>
              <button onClick={() => { setSearchTerm(''); setActiveCategory('All') }} className="mt-4 text-sm underline text-cyan-400">
                Nullstill filtre
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About / help anchors */}
      <section id="om" className="border-t border-white/5 bg-[#070f1c]/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">Om KampfiskApps</h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Premium apper og digitale produkter laget med kvalitet og omtanke.
              Fra naturutforskning med ShroomFinder til læringsverktøy og produktivitet —
              alt bygget for ekte bruk i Norge og verden.
            </p>
          </div>
          <img
            src="/brand/hero-betta-alt.png"
            alt="Kampfisk alt mascot"
            className="w-full max-w-sm mx-auto object-contain opacity-90"
          />
        </div>
      </section>

      <section id="hjelp" className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Hjelp & støtte</h2>
          <p className="text-slate-500 text-sm mb-4">Spørsmål om kjøp, nedlasting eller tilgang?</p>
          <a
            href="https://github.com/WKampfisk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:underline"
          >
            Kontakt via GitHub <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={closeModal}>
          <div
            className="modal bg-[#0a1424] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-72">
              <img src={selectedApp.image} alt={selectedApp.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/brand/hero-betta.png' }} />
              <button onClick={closeModal} className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 transition p-2 rounded-full backdrop-blur">
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1424] to-transparent h-24" />
            </div>
            <div className="p-8">
              <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
                <h3 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-white">{selectedApp.name}</h3>
                <span className="mt-2 inline-block text-xs px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-800">
                  {selectedApp.priceNo || selectedApp.price}
                </span>
              </div>
              <p className="text-lg text-slate-300 mt-1">{selectedApp.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">{selectedApp.category}</span>
                {selectedApp.tags?.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">{tag}</span>
                ))}
              </div>
              <p className="mt-6 text-[15px] leading-relaxed text-slate-300">
                {selectedApp.longDescription || selectedApp.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {selectedApp.github && (
                  <a href={selectedApp.github} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-semibold py-3 px-6 rounded-2xl transition">
                    <Github size={18} /> GitHub
                  </a>
                )}
                {selectedApp.webUrl && (
                  <a href={selectedApp.webUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-[#04101f] font-semibold py-3 px-6 rounded-2xl transition">
                    Åpne app <ExternalLink size={17} />
                  </a>
                )}
                {!selectedApp.github && !selectedApp.webUrl && (
                  <button onClick={() => alert('Denne appen er privat. Ta kontakt for tidlig tilgang.')} className="inline-flex items-center justify-center gap-2 border border-white/15 hover:bg-white/5 py-3 px-6 rounded-2xl transition">
                    Be om tilgang
                  </button>
                )}
                <button onClick={closeModal} className="px-6 py-3 text-sm font-medium border border-white/10 hover:bg-white/5 rounded-2xl transition">
                  Lukk
                </button>
              </div>
              {selectedApp.downloadInstructions && (
                <div className="mt-4 text-xs text-slate-500">{selectedApp.downloadInstructions}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#040910]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
          <div className="lg:col-span-2">
            <BrandMark />
            <p className="mt-3 text-slate-500 text-xs max-w-xs leading-relaxed">
              Premium apper og digitale produkter laget med kvalitet og omtanke.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Utforsk</div>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li><a href="#apps" className="hover:text-cyan-400">Apper</a></li>
              <li><a href="#kategorier" className="hover:text-cyan-400">Kategorier</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Kunde</div>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li><a href="#hjelp" className="hover:text-cyan-400">Hjelp og støtte</a></li>
              <li><a href="https://github.com/WKampfisk" className="hover:text-cyan-400">Kontakt oss</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Følg oss</div>
            <div className="flex gap-3 text-slate-500">
              <a href="https://github.com/WKampfisk" className="hover:text-white"><Github size={18} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-[11px] text-slate-600">
          © {new Date().getFullYear()} KampfiskApps. Alle rettigheter forbeholdt. · Norsk (bokmål)
        </div>
      </footer>
    </div>
  )
}

export default App
