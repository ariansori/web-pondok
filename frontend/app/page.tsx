import type { Metadata } from 'next';
import { HeroSection } from '../components/home/HeroSection';
import { StatsCounter } from '../components/home/StatsCounter';
import { ProfilPreview } from '../components/home/ProfilPreview';
import { LembagaCards } from '../components/home/LembagaCards';
import { AgendaMaklumatSection } from '../components/home/AgendaSection';
import { ArtikelSection } from '../components/home/ArtikelSection';
import { GallerySection } from '../components/home/GallerySection';
// import { PSMBBanner } from '../components/home/PSMBBanner';

export const metadata: Metadata = {
  title: 'Beranda | Pondok Pesantren Al-Fatich Surabaya',
  description: "Pondok Pesantren Salafi Al-Fatich Tambak Osowilangun Surabaya — Mencetak Generasi Qur'ani, Berakhlaqul Karimah, dan Berwawasan Luas sejak tahun 1988.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <ProfilPreview />
      <LembagaCards />
      <AgendaMaklumatSection />
      <ArtikelSection />
      <GallerySection />
      {/* <PSMBBanner /> */}
    </>
  );
}
