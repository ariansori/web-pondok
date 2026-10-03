'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Search,
  Check,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Send,
  ShieldCheck,
  Eye,
  Trash2,
} from 'lucide-react';
import { fetchForumQA, answerQA, deleteQA } from '@/lib/api';

interface QAItem {
  id: number;
  penanya: string;
  email?: string;
  pertanyaan: string;
  jawaban?: string;
  dijawab_oleh?: string;
  verified?: boolean;
  status: 'pending' | 'dijawab' | 'ditolak';
  created_at?: string;
}

const FALLBACK_QA: QAItem[] = [
  {
    id: 1,
    penanya: 'Wali Santri - Bapak Fulan',
    email: 'fulan@email.com',
    pertanyaan: 'Bagaimana hukum shalat jama\'ah di rumah pada saat hujan deras menurut madzhab Syafi\'i?',
    jawaban: 'Menurut madzhab Syafi\'i, diperbolehkan meninggalkan shalat jama\'ah di masjid saat hujan deras yang membasahi pakaian. Hal ini berdasarkan hadis Ibnu Abbas yang diriwayatkan oleh Bukhari-Muslim...',
    dijawab_oleh: 'Ustadz Ahmad Fauzi',
    verified: true,
    status: 'dijawab',
    created_at: '2026-09-10T08:00:00Z',
  },
  {
    id: 2,
    penanya: 'Santri Kelas 3 MA',
    pertanyaan: 'Apa perbedaan antara qiyas jaliy dan qiyas khafiy dalam ushul fiqih?',
    status: 'pending',
    created_at: '2026-09-18T14:30:00Z',
  },
  {
    id: 3,
    penanya: 'Alumni PP Al-Fatich',
    email: 'alumni@email.com',
    pertanyaan: 'Apakah sah nikah tanpa wali yang sesuai madzhab Syafi\'i jika pengantin wanita sudah janda dan ibu bapak sudah tiada?',
    status: 'pending',
    created_at: '2026-09-20T09:15:00Z',
  },
];

const STATUS_CONFIG = {
  pending: { label: 'Menunggu Jawaban', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  dijawab: { label: 'Sudah Dijawab', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function AdminForumQAPage() {
  const [qaList, setQaList] = useState<QAItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'pending' | 'dijawab' | 'ditolak'>('semua');
  const [selectedItem, setSelectedItem] = useState<QAItem | null>(null);
  const [answerForm, setAnswerForm] = useState({ jawaban: '', dijawab_oleh: 'Dewan Asatidz PP Al-Fatich' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForumQA()
      .then(data => {
        if (Array.isArray(data)) setQaList(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOpenAnswer = (item: QAItem) => {
    setSelectedItem(item);
    setAnswerForm({
      jawaban: item.jawaban || '',
      dijawab_oleh: item.dijawab_oleh || 'Dewan Asatidz PP Al-Fatich',
    });
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !answerForm.jawaban) return;

    setSaving(true);
    try {
      await answerQA(selectedItem.id, {
        jawaban: answerForm.jawaban,
        dijawab_oleh: answerForm.dijawab_oleh,
        verified: true,
        status: 'dijawab',
      });
    } catch {}

    setQaList(prev =>
      prev.map(q =>
        q.id === selectedItem.id
          ? { ...q, jawaban: answerForm.jawaban, dijawab_oleh: answerForm.dijawab_oleh, status: 'dijawab', verified: true }
          : q
      )
    );
    setSaving(false);
    setSelectedItem(null);
  };

  const handleReject = async (id: number) => {
    if (!confirm('Tolak pertanyaan ini?')) return;
    try { await answerQA(id, { jawaban: '', status: 'ditolak' }); } catch {}
    setQaList(prev => prev.map(q => q.id === id ? { ...q, status: 'ditolak' } : q));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pertanyaan ini secara permanen?')) return;
    try { await deleteQA(id); } catch {}
    setQaList(prev => prev.filter(q => q.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const filtered = qaList.filter(q => {
    const matchStatus = statusFilter === 'semua' || q.status === statusFilter;
    const matchSearch = q.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
      q.penanya.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = qaList.filter(q => q.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Tanya Jawab Syariah
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola pertanyaan santri dan wali yang membutuhkan telaah Dewan Asatidz.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800 text-xs font-bold">
            <Clock size={16} className="text-yellow-600" />
            {pendingCount} pertanyaan menunggu jawaban
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: qaList.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending', value: qaList.filter(q => q.status === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Dijawab', value: qaList.filter(q => q.status === 'dijawab').length, color: 'bg-green-50 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color} border border-current/10 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari pertanyaan atau nama penanya..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
        <div className="flex gap-2">
          {(['semua', 'pending', 'dijawab', 'ditolak'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                statusFilter === s ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.map(item => {
          const statusConf = STATUS_CONFIG[item.status];
          const StatusIcon = statusConf.icon;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all ${
                item.status === 'pending' ? 'border-yellow-200' : 'border-gray-100'
              }`}
            >
              <div className="p-5 sm:p-6">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Penanya */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                        <User size={13} className="text-green-600" />
                        <span>{item.penanya}</span>
                      </div>
                      {item.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Mail size={12} />
                          <span>{item.email}</span>
                        </div>
                      )}
                      {item.created_at && (
                        <span className="text-[11px] text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${statusConf.color}`}>
                        <StatusIcon size={10} />
                        {statusConf.label}
                      </span>
                      {item.verified && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <ShieldCheck size={10} /> Terverifikasi
                        </span>
                      )}
                    </div>

                    {/* Pertanyaan */}
                    <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-3">
                      {item.pertanyaan}
                    </p>

                    {/* Jawaban jika ada */}
                    {item.jawaban && (
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                        <p className="text-[11px] font-bold text-green-700 mb-1 flex items-center gap-1">
                          <ShieldCheck size={11} />
                          Jawaban Asatidz — {item.dijawab_oleh}
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed">{item.jawaban}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleOpenAnswer(item)}
                        className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Send size={13} /> Jawab
                      </button>
                    )}
                    {item.status === 'dijawab' && (
                      <button
                        onClick={() => handleOpenAnswer(item)}
                        className="px-4 py-2 rounded-xl border border-green-200 text-green-700 hover:bg-green-50 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Eye size={13} /> Edit Jawaban
                      </button>
                    )}
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <X size={13} /> Tolak
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <MessageSquareQuote size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">Tidak ada pertanyaan yang ditemukan</p>
        </div>
      )}

      {/* ── Answer Modal ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {selectedItem.status === 'dijawab' ? 'Edit Jawaban' : 'Tulis Jawaban Asatidz'}
              </h3>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* Pertanyaan Preview */}
            <div className="mb-5 bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-yellow-700 mb-1 flex items-center gap-1">
                <User size={11} /> {selectedItem.penanya}
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">{selectedItem.pertanyaan}</p>
            </div>

            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama / Ustadz Penjawab</label>
                <input
                  type="text"
                  value={answerForm.dijawab_oleh}
                  onChange={e => setAnswerForm({ ...answerForm, dijawab_oleh: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Teks Jawaban Syariah *</label>
                <textarea
                  required
                  rows={8}
                  value={answerForm.jawaban}
                  onChange={e => setAnswerForm({ ...answerForm, jawaban: e.target.value })}
                  placeholder="Tulis jawaban berdasarkan dalil Al-Qur'an, Hadis, dan kitab-kitab referensi pesantren..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <Check size={14} />
                  {saving ? 'Menyimpan...' : 'Publikasikan Jawaban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
