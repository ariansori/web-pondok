'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { loginAdmin, verifyOtpAdmin, resendOtpAdmin } from '@/lib/api';
import { setStoredAuth, getStoredAuth } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();

  // Login step: 1 = Email & Password, 2 = 2FA OTP Code
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  // UI / Status State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // If already logged in, redirect to /admin dashboard
    const current = getStoredAuth();
    if (current && current.token) {
      router.push('/admin');
    }
  }, [router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Quick fill helper for testing
  const handleQuickFill = (role: 'superadmin' | 'admin') => {
    if (role === 'superadmin') {
      setEmail('pondokputraaf@gmail.com');
      setPassword('@Alfatich1989.');
    } else {
      setEmail('admin@alfatich.ponpes.id');
      setPassword('@Alfatich1989.');
    }
    setErrorMsg('');
  };

  // Step 1: Submit Email & Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginAdmin({ email: email.trim(), password });
      if (res.requireOtp) {
        setMaskedEmail(res.maskedEmail || email);
        if (res.devOtp) setDevOtpHint(res.devOtp);
        setStep(2);
        setResendCooldown(60);
        setSuccessMsg('Kode verifikasi keamanan (OTP) 6-digit telah dikirim ke email aktif Anda.');
      } else if (res.token && res.user) {
        // Direct login if 2FA disabled
        setStoredAuth({ ...res.user, token: res.token });
        router.push('/admin');
      }
    } catch (err: any) {
      // Fallback local authentication simulator if backend is offline
      if (email.trim().toLowerCase() === 'pondokputraaf@gmail.com' && password === '@Alfatich1989.') {
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setMaskedEmail('pon***af@gmail.com');
        setDevOtpHint(mockOtp);
        setStep(2);
        setResendCooldown(60);
        setSuccessMsg(`Simulasi Offline: Kode OTP Anda adalah ${mockOtp}`);
      } else if (email.trim().toLowerCase() === 'admin@alfatich.ponpes.id' && password === '@Alfatich1989.') {
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setMaskedEmail('adm***id@alfatich.ponpes.id');
        setDevOtpHint(mockOtp);
        setStep(2);
        setResendCooldown(60);
        setSuccessMsg(`Simulasi Offline: Kode OTP Anda adalah ${mockOtp}`);
      } else {
        setErrorMsg(err?.response?.data?.message || 'Email atau kata sandi tidak sesuai. Silakan periksa kembali.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP Code
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Masukkan 6 digit kode verifikasi OTP yang valid');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await verifyOtpAdmin({ email: email.trim(), otp: otp.trim() });
      if (res.token && res.user) {
        setStoredAuth({ ...res.user, token: res.token });
        router.push('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Kode OTP tidak sesuai atau telah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await resendOtpAdmin({ email: email.trim() });
      if (res.devOtp) setDevOtpHint(res.devOtp);
      setResendCooldown(60);
      setSuccessMsg('Kode verifikasi baru berhasil dikirimkan ke email Anda.');
    } catch {
      const newMockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setDevOtpHint(newMockOtp);
      setResendCooldown(60);
      setSuccessMsg(`Kode OTP baru (Simulasi): ${newMockOtp}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, #072a14 0%, #0D5C2B 50%, #169645 100%)' }}>
      {/* Background Islamic Pattern Accent */}
      <div className="absolute inset-0 bg-pattern-islamic opacity-20 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Card Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 relative overflow-hidden backdrop-blur-md">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4"
              style={{ background: 'linear-gradient(135deg, #F4B41A, #D4970E)' }}>
              <span className="text-gray-950 font-black">AF</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Portal Admin Pesantren
            </h1>
            <p className="text-xs text-green-700 font-bold uppercase tracking-wider mt-1">
              PP Salafi Al-Fatich Surabaya
            </p>
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-green-600" />
              <div>
                <span>{successMsg}</span>
                {devOtpHint && (
                  <div className="mt-2 font-mono font-bold bg-white px-2 py-1 rounded border border-green-300 text-green-900 inline-block">
                    KODE OTP: {devOtpHint}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 1: Email & Password Form ── */}
          {step === 1 ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-green-700" />
                  Email Aktif Admin *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="pondokputraaf@gmail.com"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Lock size={14} className="text-green-700" />
                    Kata Sandi *
                  </label>
                  <span className="text-[11px] text-green-700 font-semibold hover:underline cursor-pointer"
                    onClick={() => alert('Untuk reset kata sandi, hubungi Super Admin atau gunakan akun email aktif resmi.')}>
                    Lupa sandi?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loading ? 'Memverifikasi...' : 'Lanjut Verifikasi OTP'}
                <ArrowRight size={16} />
              </button>

              {/* Quick Fill Demo Shortcuts */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  Opsi Akun Default (1-Klik):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('superadmin')}
                    className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={14} className="text-amber-700" />
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin')}
                    className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserCheck size={14} className="text-green-700" />
                    Admin Konten
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ── STEP 2: 2FA Email OTP Verification Form ── */
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-inner">
                  <KeyRound size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Verifikasi 2-Faktor (2FA)</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Masukkan 6-digit kode keamanan yang telah dikirim ke email:<br />
                  <strong className="text-gray-900">{maskedEmail}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[12px] font-mono text-2xl font-black py-3.5 rounded-2xl border-2 border-green-600 focus:outline-none focus:ring-4 focus:ring-green-100 bg-green-50/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-sm shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Memvalidasi OTP...' : 'Masuk ke Dashboard Admin'}
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 hover:text-gray-800 transition-colors font-semibold"
                >
                  <ArrowLeft size={14} /> Ganti Email
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendOtp}
                  className="text-green-700 hover:text-green-900 font-bold disabled:opacity-40 disabled:hover:text-green-700"
                >
                  {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Footer return to website */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-green-700 font-medium transition-colors">
              ← Kembali ke Halaman Utama Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
