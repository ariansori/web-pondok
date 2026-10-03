'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type NavChild = { label: string; href?: string; children?: NavChild[] };
type NavItem = { label: string; href: string; children?: NavChild[] };

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobile, setActiveMobile] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setActiveDropdown(null);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-shadow duration-300',
        scrolled ? 'shadow-lg shadow-green-900/20' : ''
      )}
      style={{ height: 'var(--navbar-height)', background: 'linear-gradient(135deg, #169645, #0D5C2B)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
            <Image
              src="/lambang-alfatich.png"
              alt="Logo Pondok Pesantren Al-Fatich"
              width={48}
              height={48}
              className="object-contain w-full h-full p-0.5"
              priority
            />
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {(NAV_LINKS as NavItem[]).map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-base font-semibold transition-colors duration-200',
                  isActive(item.href) && item.href !== '/'
                    ? 'text-yellow-300 bg-white/10'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    size={16}
                    className={cn('transition-transform duration-200', activeDropdown === item.label && 'rotate-180')}
                  />
                )}
              </Link>

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 pt-2 min-w-[220px] z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                    {item.children.map((child) => (
                      child.href ? (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          {child.label}
                        </Link>
                      ) : (
                        /* Multi-level group */
                        <div key={child.label}>
                          <p className="px-4 pt-3 pb-1 text-xs font-bold text-green-600 uppercase tracking-wider">
                            {child.label}
                          </p>
                          {child.children?.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href || '#'}
                              className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors ml-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-yellow-400 flex-shrink-0" />
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── PSMB CTA + Burger ── */}
        <div className="flex items-center gap-3">
          <Link
            href="/psmb"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-bold text-gray-900 shadow-lg animate-pulse-gold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #F4B41A, #D4970E)' }}
          >
            <GraduationCap size={18} />
            PSMB
          </Link>

          {/* Burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {/* PSMB Mobile */}
          <Link
            href="/psmb"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-gray-900 mb-3"
            style={{ background: 'linear-gradient(135deg, #F4B41A, #D4970E)' }}
          >
            <GraduationCap size={18} />
            Daftar PSMB Sekarang
          </Link>

          {(NAV_LINKS as NavItem[]).map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setActiveMobile(activeMobile === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-gray-800 text-sm font-semibold hover:bg-green-50 transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={cn('transition-transform', activeMobile === item.label && 'rotate-180')}
                    />
                  </button>
                  {activeMobile === item.label && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-green-100 pl-3">
                      {item.children.map((child) =>
                        child.href ? (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ) : (
                          <div key={child.label}>
                            <p className="px-3 pt-2 pb-1 text-xs font-bold text-green-600 uppercase">{child.label}</p>
                            {child.children?.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href || '#'}
                                className="block px-3 py-2 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors ml-2"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                    isActive(item.href) ? 'text-green-700 bg-green-50' : 'text-gray-800 hover:bg-green-50 hover:text-green-700'
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}