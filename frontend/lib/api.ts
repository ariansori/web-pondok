import axios from 'axios';
import { getStoredAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to automatically attach JWT token for authenticated requests
api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for consistent response data handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized occurs on admin route, we can notify or handle gracefully
    return Promise.reject(error);
  }
);

// ── Types ──

export interface AgendaItem {
  id: number;
  judul: string;
  deskripsi?: string;
  tanggal_mulai: string;
  tanggal_selesai?: string | null;
  lokasi?: string | null;
  kategori?: string | null;
  status: 'upcoming' | 'ongoing' | 'done';
  created_at?: string;
  updated_at?: string;
}

export interface MaklumatItem {
  id: number;
  judul: string;
  konten: string;
  kategori: 'pengumuman' | 'maklumat' | 'berita';
  penting: boolean | number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArtikelItem {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  ringkasan: string;
  penulis: string;
  kategori: string;
  tags?: string;
  thumbnail?: string;
  published: boolean | number;
  published_at?: string;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GaleriItem {
  id: number;
  judul: string;
  deskripsi?: string;
  tipe: 'foto' | 'video';
  url: string;
  thumbnail?: string;
  kategori: string;
  tanggal?: string;
  created_at?: string;
}

export interface ForumQAItem {
  id: number;
  penanya: string;
  email?: string | null;
  pertanyaan: string;
  jawaban?: string | null;
  dijawab_oleh?: string | null;
  dijawab_at?: string | null;
  status: 'pending' | 'answered' | 'dijawab' | 'closed' | 'ditolak';
  verified: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface BahtsuItem {
  id: number;
  judul: string;
  kategori: string;
  tahun: number;
  deskripsi: string;
  file_url?: string | null;
  download_count?: number;
  created_at?: string;
}

export interface PSMBItem {
  id: number;
  nama_lengkap: string;
  nama_santri?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin: 'L' | 'P';
  asal_sekolah?: string;
  jenjang: 'RA' | 'MI' | 'MTs' | 'MA';
  nama_ayah?: string;
  nama_ibu?: string;
  nama_wali?: string;
  no_hp: string;
  no_hp_wali?: string;
  alamat?: string;
  catatan?: string;
  program_tambahan?: string;
  status: 'pending' | 'diterima' | 'ditolak';
  created_at?: string;
  updated_at?: string;
}

export interface LembagaItem {
  id: number | string;
  nama: string;
  singkatan?: string;
  kategori: 'dloruriyat' | 'hajiyat';
  deskripsi?: string;
  kurikulum?: string | string[];
  icon?: string;
  sort_order?: number;
  aktif?: boolean | number;
}

export interface AdminStats {
  totalPSMB: number;
  pendingPSMB: number;
  totalArtikel: number;
  totalAgenda: number;
  totalMaklumat: number;
  totalQA: number;
  pendingQA: number;
  totalBahtsu: number;
  totalGaleri: number;
}

// ── Auth APIs ──

export async function loginAdmin(data: { email: string; password: string }) {
  const res = await api.post('/auth/login', data);
  return res.data;
}

export async function verifyOtpAdmin(data: { email: string; otp: string }) {
  const res = await api.post('/auth/verify-otp', data);
  return res.data;
}

export async function resendOtpAdmin(data: { email: string }) {
  const res = await api.post('/auth/resend-otp', data);
  return res.data;
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

// ── Agenda APIs ──

export async function fetchAgenda(params?: { status?: string; limit?: number; kategori?: string }): Promise<AgendaItem[]> {
  const res = await api.get('/agenda', { params });
  return res.data?.data || [];
}

export async function fetchAgendaById(id: number | string): Promise<AgendaItem> {
  const res = await api.get(`/agenda/${id}`);
  return res.data?.data;
}

export async function createAgenda(data: Partial<AgendaItem>) {
  const res = await api.post('/agenda', data);
  return res.data;
}

export async function updateAgenda(id: number | string, data: Partial<AgendaItem>) {
  const res = await api.put(`/agenda/${id}`, data);
  return res.data;
}

export async function deleteAgenda(id: number | string) {
  const res = await api.delete(`/agenda/${id}`);
  return res.data;
}

// ── Maklumat APIs ──

export async function fetchMaklumat(params?: { kategori?: string; limit?: number }): Promise<MaklumatItem[]> {
  const res = await api.get('/maklumat', { params });
  return res.data?.data || [];
}

export async function fetchMaklumatById(id: number | string): Promise<MaklumatItem> {
  const res = await api.get(`/maklumat/${id}`);
  return res.data?.data;
}

export async function createMaklumat(data: Partial<MaklumatItem>) {
  const res = await api.post('/maklumat', data);
  return res.data;
}

export async function updateMaklumat(id: number | string, data: Partial<MaklumatItem>) {
  const res = await api.put(`/maklumat/${id}`, data);
  return res.data;
}

export async function deleteMaklumat(id: number | string) {
  const res = await api.delete(`/maklumat/${id}`);
  return res.data;
}

// ── Artikel APIs ──

export async function fetchArtikel(params?: { kategori?: string; limit?: number; page?: number; published?: string | boolean; admin?: boolean }): Promise<{ data: ArtikelItem[]; meta?: any }> {
  const res = await api.get('/artikel', { params });
  if (Array.isArray(res.data?.data)) {
    return { data: res.data.data, meta: res.data.meta };
  }
  return { data: res.data || [] };
}

export async function fetchArtikelBySlug(slug: string): Promise<ArtikelItem> {
  const res = await api.get(`/artikel/${slug}`);
  return res.data?.data;
}

export async function createArtikel(data: Partial<ArtikelItem>) {
  const res = await api.post('/artikel', data);
  return res.data;
}

export async function updateArtikel(id: number | string, data: Partial<ArtikelItem>) {
  const res = await api.put(`/artikel/${id}`, data);
  return res.data;
}

export async function deleteArtikel(id: number | string) {
  const res = await api.delete(`/artikel/${id}`);
  return res.data;
}

// ── Galeri APIs ──

export async function fetchGaleri(params?: { tipe?: string; kategori?: string; limit?: number }): Promise<GaleriItem[]> {
  const res = await api.get('/galeri', { params });
  return res.data?.data || [];
}

export async function createGaleri(data: Partial<GaleriItem>) {
  const res = await api.post('/galeri', data);
  return res.data;
}

export async function updateGaleri(id: number | string, data: Partial<GaleriItem>) {
  const res = await api.put(`/galeri/${id}`, data);
  return res.data;
}

export async function deleteGaleri(id: number | string) {
  const res = await api.delete(`/galeri/${id}`);
  return res.data;
}

// ── Forum QA & Bahtsu APIs ──

export async function fetchForumQA(params?: { status?: string; limit?: number; page?: number }): Promise<ForumQAItem[]> {
  const res = await api.get('/forum/qa', { params });
  return res.data?.data || [];
}

export async function submitQA(data: { penanya: string; email?: string; pertanyaan: string }) {
  const res = await api.post('/forum/qa', data);
  return res.data;
}

export async function answerQA(id: number | string, data: { jawaban: string; dijawab_oleh?: string; status?: string; verified?: boolean }) {
  const res = await api.put(`/forum/qa/${id}`, data);
  return res.data;
}

export async function deleteQA(id: number | string) {
  const res = await api.delete(`/forum/qa/${id}`);
  return res.data;
}

export async function fetchBahtsu(params?: { kategori?: string; tahun?: number | string; search?: string; limit?: number }): Promise<BahtsuItem[]> {
  const res = await api.get('/forum/bahtsu', { params });
  return res.data?.data || [];
}

export async function createBahtsu(data: Partial<BahtsuItem>) {
  const res = await api.post('/forum/bahtsu', data);
  return res.data;
}

export async function updateBahtsu(id: number | string, data: Partial<BahtsuItem>) {
  const res = await api.put(`/forum/bahtsu/${id}`, data);
  return res.data;
}

export async function deleteBahtsu(id: number | string) {
  const res = await api.delete(`/forum/bahtsu/${id}`);
  return res.data;
}

export async function downloadBahtsu(id: number | string) {
  const res = await api.post(`/forum/bahtsu/${id}/download`);
  return res.data;
}

// ── PSMB APIs ──

export async function submitPSMB(data: Record<string, any>) {
  const res = await api.post('/psmb', data);
  return res.data;
}

export async function fetchPSMBList(): Promise<PSMBItem[]> {
  const res = await api.get('/psmb');
  return res.data?.data || [];
}

export async function updatePSMBStatus(id: number | string, status: 'pending' | 'diterima' | 'ditolak') {
  const res = await api.put(`/psmb/${id}/status`, { status });
  return res.data;
}

export async function deletePSMB(id: number | string) {
  const res = await api.delete(`/psmb/${id}`);
  return res.data;
}

// ── Profil & Stats APIs ──

export async function fetchProfil(): Promise<Record<string, any>> {
  const res = await api.get('/profil');
  return res.data?.data || {};
}

export async function updateProfil(data: Record<string, any>) {
  const res = await api.put('/profil', data);
  return res.data;
}

export async function fetchSejarah(): Promise<any[]> {
  const res = await api.get('/profil/sejarah');
  return res.data?.data || [];
}

export async function fetchFilosofi(): Promise<any[]> {
  const res = await api.get('/profil/filosofi');
  return res.data?.data || [];
}

export async function fetchStats(): Promise<any[]> {
  const res = await api.get('/stats');
  return res.data?.data || [];
}

export async function updateStats(data: any) {
  const res = await api.put('/stats', data);
  return res.data;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await api.get('/admin/stats');
  return res.data?.data;
}

// ── Lembaga APIs ──

export async function fetchLembaga(params?: { kategori?: string }): Promise<LembagaItem[]> {
  const res = await api.get('/lembaga', { params });
  return res.data?.data || [];
}

export async function fetchLembagaById(id: number | string): Promise<LembagaItem> {
  const res = await api.get(`/lembaga/${id}`);
  return res.data?.data;
}

// ── Users Management APIs ──

export async function fetchUsers(): Promise<any[]> {
  const res = await api.get('/users');
  return res.data?.data || [];
}

export async function createUser(data: any) {
  const res = await api.post('/users', data);
  return res.data;
}

export async function updateUser(id: number | string, data: any) {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
}

export async function deleteUser(id: number | string) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}
