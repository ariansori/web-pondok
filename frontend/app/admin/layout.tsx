'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  Megaphone, 
  Image as ImageIcon, 
  MessageSquareQuote, 
  Scroll, 
  GraduationCap, 
  Sliders, 
  Users, 
  LogOut, 
  Globe, 
  ChevronRight, 
  Menu, 
  X, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Lock
} from 'lucide-react';
import { getStoredAuth, clearStoredAuth, isSuperAdmin, AdminUser } from '@/lib/auth';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Artikel & Berita', href: '/admin/artikel', icon: BookOpen },
  { label: 'Agenda & Acara', href: '/admin/agenda', icon: CalendarDays },
  { label: 'Maklumat Resmi', href: '/admin/maklumat', icon: Megaphone },
  { label: 'Galeri Kegiatan', href: '/admin/galeri', icon: ImageIcon },
  { label: 'Tanya Jawab Syariah', href: '/admin/forum-qa', icon: MessageSquareQuote },
  { label: 'Bahtsu Masail', href: '/admin/bahtsu-masail', icon: Scroll },
  { label: 'Pendaftaran PSMB', href: '/admin/psmb', icon: GraduationCap },
  { label: 'Profil & Statistik', href: '/admin/profil', icon: Sliders },
  { label: 'Manajemen Admin', href: '/admin/users', icon: Users, superadminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Exclude login page from protection
    if (pathname === '/admin/login') return;

    const current = getStoredAuth();
    if (!current || !current.token) {
      router.push('/admin/login');
    } else {
      setUser(current);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    clearStoredAuth();
    router.push('/admin/login');
  };

  // If on login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-sm">Memuat sesi admin...</div>;
  }

  const isSuper = isSuperAdmin(user);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* ── Sidebar Desktop & Mobile ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#072a14] via-[#0D5C2B] to-[#0a4a22] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-yellow-500 text-gray-950 font-black flex items-center justify-center text-lg shadow-md">
                AF
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight text-white leading-tight">Al-Fatich Admin</h2>
                <p className="text-[11px] text-yellow-300 font-semibold">CMS Panel v2.0</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Badge in Sidebar */}
          {user && (
            <div className="px-6 py-4 border-b border-white/10 bg-black/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 text-yellow-300 flex items-center justify-center font-bold text-sm">
                  {user.nama.charAt(0)}
                </div>
                <div className="truncate flex-1">
                  <p className="text-xs font-bold text-white truncate">{user.nama}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                        isSuper
                          ? 'bg-amber-400 text-gray-950'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {isSuper ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {NAV_ITEMS.map((item) => {
              if (item.superadminOnly && !isSuper) return null;

              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-white text-green-900 shadow-md font-bold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={active ? 'text-green-800' : 'text-yellow-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.superadminOnly && (
                    <span className="text-[10px] bg-amber-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-bold uppercase">
                      Super
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Globe size={16} className="text-green-400" />
            <span>Lihat Website Publik</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut size={16} />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ── Main Container ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-gray-500">Panel Administrasi</span>
              <p className="text-sm font-bold text-gray-900">Pondok Pesantren Salafi Al-Fatich</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Superadmin Badge */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900">{user?.nama || 'Admin'}</p>
                <p className="text-[11px] text-gray-500">{user?.email}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm ${
                  isSuper
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-green-100 text-green-900 border border-green-300'
                }`}
              >
                {isSuper ? <ShieldCheck size={14} className="text-amber-700" /> : <UserCheck size={14} className="text-green-700" />}
                {isSuper ? 'Super Admin' : 'Admin Konten'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
