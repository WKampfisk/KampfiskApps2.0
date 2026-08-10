import React, { useState, useMemo } from 'react'
import {
  Search, X, ExternalLink, Github, Star, ArrowRight,
  Shield, Download, HeartHandshake, BadgeCheck, ShoppingCart,
  Rocket, Wrench, Heart, Gamepad2, BookOpen, LayoutGrid,
  Sparkles, Mail,
} from 'lucide-react'
import { apps, categories, categoryTiles } from './data/apps'

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

const TILE_ICONS = {
  Rocket,
  Wrench,
  Heart,
  Gamepad2,
  BookOpen,
  LayoutGrid,
}

function BrandMark({ size = 'md' }) {
  const img = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const text = size === 'sm' ? 'text-base' : 'text-lg'
  return (
    <a href="#" className="flex items-center gap-2.5 group shrink-0">
      <span
        className={`${img} rounded-full overflow-hidden ring-2 ring-cyan-100 shadow-sm shadow-cyan-200/50 bg-slate-900`}
      >
        <img
          src="/brand/logo2BEST.png"
          alt="KampfiskApps"
          className="h-full w-full logo-betta"
        />
      </span>
      <div className="leading-none">
        <span className={`font-bold ${text} tracking-tight text-slate-900`}>Kampfisk</span>
        <span className={`font-bold ${text} tracking-tight text-rose-500`}>Apps</span>
      </div>
    </a>
  )
}

function AppIcon({ app, size = 'md' }) {
  const dim = size === 'lg' ? 'w-16 h-16 text-lg' : size === 'sm' ? 'w-10 h-10 text-xs' : 'w-14 h-14 text-sm'
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br ${app.iconTone || 'from-cyan-400 to-sky-500'} flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/15 ring-4 ring-white`}
    >
      {app.iconLabel || app.name.slice(0, 2).toUpperCase()}
    </div>
  )
}

function CoverArt({ app }) {
  return (
    <div
      className={`card-cover card-cover-noise relative h-full w-full bg-gradient-to-br ${app.iconTone || 'from-cyan-400 to-sky-500'}`}
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,white,transparent_45%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl font-extrabold text-white/25 tracking-tighter select-none">
          {app.iconLabel || app.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="absolute bottom-3 left-3">
        <AppIcon app={app} size="sm" />
      </div>
    </div>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedApp, setSelectedApp] = useState(null)
  const [sortMode, setSortMode] = useState('featured')
  const [mobileNav, setMobileNav] = useState(false)

  const liveCount = useMemo(() => apps.filter((a) => a.status === 'Live').length, [])

  const filteredApps = useMemo(() => {
    let result = [...apps]
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.tagline.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          (app.tags && app.tags.join(' ').toLowerCase().includes(q)),
      )
    }
    if (activeCategory !== 'All') {
      result = result.filter((app) => app.category === activeCategory)
    }
    if (sortMode === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'nb'))
    } else if (sortMode === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name, 'nb'))
    } else {
      const rank = (a) => (a.status === 'Live' ? 0 : 1) * 10 + (a.featured ? 0 : 1)
      result.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'nb'))
    }
    return result
  }, [searchTerm, activeCategory, sortMode])

  const featured = useMemo(() => apps.filter((a) => a.featured).slice(0, 4), [])

  const statusClass = (status) =>
    status === 'Live'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-700 border-amber-200'

  const openApp = (app) => {
    setSelectedApp(app)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedApp(null)
    document.body.style.overflow = 'unset'
  }

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && selectedApp) closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedApp])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileNav(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar — Light & Bright */}
      <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          <BrandMark />

          <div className="hidden md:flex items-center gap-0.5 text-sm">
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
                className="px-3.5 py-2 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition font-medium"
              >
                {n.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => scrollTo('apps')}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              aria-label="Gå til apper"
              title="Apper"
            >
              <ShoppingCart size={18} />
            </button>
            <a
              href="mailto:post@kampfiskapps.com?subject=KampfiskApps"
              className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-semibold text-sm px-4 py-2 rounded-xl transition shadow-md shadow-cyan-500/20"
            >
              Kontakt
            </a>
            <span className="hidden sm:inline text-base" title="Norsk">
              🇳🇴
            </span>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileNav((v) => !v)}
              aria-label="Meny"
            >
              {mobileNav ? <X size={20} /> : <LayoutGrid size={20} />}
            </button>
          </div>
        </div>
        {mobileNav && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-3 space-y-1">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault()
                  if (n.href === '#') window.scrollTo({ top: 0, behavior: 'smooth' })
                  else scrollTo(n.href.slice(1))
                }}
                className="block px-3 py-2.5 rounded-lg text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 text-sm font-medium"
              >
                {n.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 hero-light pointer-events-none" />
        <div className="hero-waves" aria-hidden />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-14 sm:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-6 items-center relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/90 px-3 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm mb-5">
              <Sparkles size={12} className="text-cyan-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {liveCount} apper live nå
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.06] text-slate-900">
              Oppdag. Kjøp.
              <br />
              Bruk. <span className="text-rose-500">Kampfisk.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-500 max-w-md leading-relaxed">
              Kvalitetsapper og digitale produkter laget for deg.
            </p>

            <div className="mt-7 relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                placeholder="Søk etter apper eller produkter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') scrollTo('apps')
                }}
                className="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 pl-11 pr-28 py-3.5 rounded-2xl text-sm placeholder:text-slate-400 outline-none transition shadow-sm"
              />
              <button
                type="button"
                onClick={() => scrollTo('apps')}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
              >
                Søk
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={() => scrollTo('apps')}
                className="bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-400 hover:to-orange-300 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-rose-500/25"
              >
                Utforsk apper
              </button>
              <button
                type="button"
                onClick={() => scrollTo('kategorier')}
                className="border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50 font-semibold px-6 py-3 rounded-xl transition bg-white"
              >
                Se kategorier
              </button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end min-h-[280px] sm:min-h-[360px]">
            <div className="absolute w-[70%] h-[70%] rounded-full bg-cyan-200/35 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <img
              src="/brand/hero-betta.png"
              alt="Kampfisk — betta mascot"
              className="hero-mascot relative z-10 w-full max-w-xl object-contain select-none"
              draggable={false}
              onError={(e) => {
                e.currentTarget.src = '/brand/logo2BEST.png'
              }}
            />
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0 shadow-sm">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{title}</div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured apps — circular icons like layout-webstore */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-12 sm:pt-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Utvalgte apper</h2>
          <button
            type="button"
            onClick={() => scrollTo('apps')}
            className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 font-medium"
          >
            Se alle <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => openApp(app)}
              className="feature-card text-left group rounded-3xl border border-slate-200/90 bg-white hover:border-cyan-200 p-6 transition"
            >
              <AppIcon app={app} />
              <div className="mt-4 font-semibold text-slate-900 group-hover:text-cyan-700 transition text-lg tracking-tight">
                {app.name}
              </div>
              <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                {app.categoryNo || app.category}
              </div>
              <div className="flex items-center justify-between mt-4 gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="font-medium text-slate-700">{app.rating || '4.6'}</span>
                  <span className="text-slate-400">({app.reviews || 24})</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusClass(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
              <div className="mt-3 text-base font-bold text-slate-900">
                {app.priceNo || app.price}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="kategorier" className="max-w-7xl mx-auto px-5 sm:px-6 pt-14">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Kategorier</h2>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All')
              scrollTo('apps')
            }}
            className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 font-medium"
          >
            Se alle <ArrowRight size={14} />
          </button>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {categoryTiles.map((tile) => {
              const Icon = TILE_ICONS[tile.icon] || LayoutGrid
              const active = activeCategory === tile.id
              return (
                <button
                  key={tile.id + tile.label}
                  type="button"
                  onClick={() => {
                    setActiveCategory(tile.id)
                    scrollTo('apps')
                  }}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition ${
                    active
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-700 shadow-sm'
                      : 'bg-slate-50/50 border-transparent text-slate-600 hover:border-cyan-100 hover:bg-cyan-50/40'
                  }`}
                >
                  <Icon size={22} className={active ? 'text-cyan-600' : 'text-slate-400'} strokeWidth={1.75} />
                  <span className="text-[11px] font-medium text-center leading-tight">{tile.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat)
                scrollTo('apps')
              }}
              className={`px-4 py-2 text-sm rounded-xl border transition font-medium ${
                activeCategory === cat
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {cat === 'All' ? 'Alle' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Full catalog */}
      <section id="apps" className="max-w-7xl mx-auto px-5 sm:px-6 pt-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Alle apper</h2>
            <p className="text-slate-500 mt-1 text-sm">Oppdag verktøy bygget for ekte behov</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Søk i katalogen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 pl-11 pr-4 py-2.5 rounded-2xl text-sm placeholder:text-slate-400 outline-none shadow-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="bg-white border border-slate-200 text-sm rounded-2xl px-4 py-2.5 outline-none cursor-pointer text-slate-700 shadow-sm"
            >
              <option value="featured">Utvalgte</option>
              <option value="name">A — Å</option>
              <option value="category">Kategori</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 mb-4">
          Viser {filteredApps.length} av {apps.length} apper
          {activeCategory !== 'All' && (
            <span className="text-cyan-600"> · {activeCategory}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => openApp(app)}
                onKeyDown={(e) => e.key === 'Enter' && openApp(app)}
                role="button"
                tabIndex={0}
                className="app-card group bg-white border border-slate-200 hover:border-cyan-300 rounded-3xl overflow-hidden cursor-pointer flex flex-col shadow-sm"
              >
                <div className="relative h-44 overflow-hidden">
                  <CoverArt app={app} />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm border backdrop-blur-sm ${statusClass(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[11px] px-2.5 py-1 bg-white/95 text-slate-700 rounded-xl font-medium shadow-sm border border-white/80">
                      {app.categoryNo || app.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-semibold text-xl tracking-tight mb-1 text-slate-900 group-hover:text-cyan-700 transition">
                    {app.name}
                  </div>
                  <div className="text-slate-500 text-sm leading-snug line-clamp-2 mb-4">{app.tagline}</div>
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <div className="font-bold text-cyan-600">{app.priceNo || app.price}</div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600">
                      Detaljer <ArrowRight size={15} className="group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                  {(app.rating || app.reviews) && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-500">
                      <Star size={11} fill="currentColor" />
                      <span className="font-medium text-slate-600">{app.rating}</span>
                      <span className="text-slate-400">({app.reviews})</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white">
              <p className="text-slate-500">Ingen apper matcher søket.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setActiveCategory('All')
                }}
                className="mt-4 text-sm font-medium text-cyan-600 hover:underline"
              >
                Nullstill filtre
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="om" className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1 mb-4">
              Om oss
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Om KampfiskApps</h2>
            <p className="text-slate-500 leading-relaxed text-[15px]">
              Premium apper og digitale produkter laget med kvalitet og omtanke. Fra naturutforskning
              med FungaDex til familie, lesing og produktivitet — alt bygget for ekte bruk i Norge og
              verden.
            </p>
            <p className="text-slate-400 text-sm mt-5 flex items-center gap-2">
              <Mail size={14} className="text-cyan-500" />
              <a href="mailto:post@kampfiskapps.com" className="hover:text-cyan-600 transition">
                post@kampfiskapps.com
              </a>
            </p>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute w-3/4 h-3/4 bg-cyan-100/60 blur-3xl rounded-full" />
            <img
              src="/brand/logo1BEST.png"
              alt="Kampfisk betta"
              className="relative w-full max-w-sm object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      <section id="hjelp" className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hjelp & støtte</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Spørsmål om kjøp, nedlasting eller tilgang? Vi svarer på e-post.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:post@kampfiskapps.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 rounded-xl shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-sky-400 transition"
            >
              <Mail size={16} /> post@kampfiskapps.com
            </a>
            <a
              href="https://github.com/WKampfisk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 px-5 py-2.5 rounded-xl transition"
            >
              GitHub <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="modal modal-scroll bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 sm:h-60">
              <CoverArt app={selectedApp} />
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/95 hover:bg-white transition p-2 rounded-full shadow border border-slate-100 z-10"
                aria-label="Lukk"
              >
                <X size={20} className="text-slate-700" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent h-16" />
            </div>
            <div className="p-8 pt-0 relative">
              <div className="flex flex-wrap items-start gap-x-4 gap-y-2 -mt-2">
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  {selectedApp.name}
                </h3>
                <span className="mt-2 inline-block text-xs px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 font-semibold">
                  {selectedApp.priceNo || selectedApp.price}
                </span>
                <span
                  className={`mt-2 inline-block text-xs px-3 py-1 rounded-full border font-semibold ${statusClass(selectedApp.status)}`}
                >
                  {selectedApp.status}
                </span>
              </div>
              <p className="text-lg text-slate-600 mt-2">{selectedApp.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {selectedApp.categoryNo || selectedApp.category}
                </span>
                {selectedApp.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-[15px] leading-relaxed text-slate-600">
                {selectedApp.longDescription || selectedApp.description}
              </p>
              {selectedApp.plans?.length > 0 && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                    {selectedApp.stripeEnabled ? 'Stripe-abonnement' : 'Planer'}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedApp.plans.map((plan) => (
                      <a
                        key={plan.id}
                        href={plan.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col gap-1 rounded-xl border border-white bg-white px-4 py-3 shadow-sm hover:border-cyan-300 hover:shadow transition"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900">{plan.label}</span>
                          <span className="text-sm font-bold text-cyan-600">{plan.priceNo}</span>
                        </div>
                        {plan.note && <span className="text-xs text-slate-500">{plan.note}</span>}
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-cyan-700">
                          Gå til betaling <ExternalLink size={12} />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 mt-8">
                {(selectedApp.purchaseUrl || selectedApp.webUrl) && (
                  <a
                    href={selectedApp.purchaseUrl || selectedApp.webUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold py-3 px-6 rounded-2xl transition shadow-md shadow-cyan-500/25"
                  >
                    {selectedApp.ctaLabel ||
                      (selectedApp.purchaseUrl ? 'Kjøp / åpne app' : 'Åpne app')}{' '}
                    <ExternalLink size={17} />
                  </a>
                )}
                {selectedApp.webUrl &&
                  selectedApp.purchaseUrl &&
                  selectedApp.purchaseUrl !== selectedApp.webUrl && (
                    <a
                      href={selectedApp.webUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold py-3 px-6 rounded-2xl transition"
                    >
                      Åpne gratis <ExternalLink size={17} />
                    </a>
                  )}
                {selectedApp.apkUrl && (
                  <a
                    href={selectedApp.apkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-2xl transition"
                  >
                    <Download size={18} /> Last ned APK
                  </a>
                )}
                {selectedApp.github && (
                  <a
                    href={selectedApp.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-2xl transition"
                  >
                    <Github size={18} /> GitHub
                  </a>
                )}
                {!selectedApp.github && !selectedApp.webUrl && !selectedApp.purchaseUrl && (
                  <a
                    href={`mailto:post@kampfiskapps.com?subject=${encodeURIComponent(
                      `Tilgang til ${selectedApp.name}`,
                    )}`}
                    className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-3 px-6 rounded-2xl transition font-medium text-slate-700"
                  >
                    {selectedApp.ctaLabel || 'Be om tilgang'}
                  </a>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-sm font-medium border border-slate-200 hover:bg-slate-50 rounded-2xl transition text-slate-600"
                >
                  Lukk
                </button>
              </div>
              {selectedApp.downloadInstructions && (
                <div className="mt-5 text-xs text-slate-400 leading-relaxed">
                  {selectedApp.downloadInstructions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
          <div className="lg:col-span-2">
            <BrandMark size="sm" />
            <p className="mt-3 text-slate-500 text-xs max-w-xs leading-relaxed">
              Premium apper og digitale produkter laget med kvalitet og omtanke.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-3">Utforsk</div>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li>
                <a href="#apps" className="hover:text-cyan-600">
                  Apper
                </a>
              </li>
              <li>
                <a href="#kategorier" className="hover:text-cyan-600">
                  Kategorier
                </a>
              </li>
              <li>
                <a href="#om" className="hover:text-cyan-600">
                  Om oss
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-3">Kunde</div>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li>
                <a href="#hjelp" className="hover:text-cyan-600">
                  Hjelp og støtte
                </a>
              </li>
              <li>
                <a href="mailto:post@kampfiskapps.com" className="hover:text-cyan-600">
                  Kontakt oss
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-3">Juridisk</div>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li>
                <span className="text-slate-400">Personvern (kommer)</span>
              </li>
              <li>
                <span className="text-slate-400">Kjøpsvilkår (kommer)</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-slate-400">
          <span>© {new Date().getFullYear()} KampfiskApps. Alle rettigheter forbeholdt.</span>
          <span className="hidden sm:inline">·</span>
          <span>Norsk (bokmål)</span>
        </div>
      </footer>
    </div>
  )
}

export default App
