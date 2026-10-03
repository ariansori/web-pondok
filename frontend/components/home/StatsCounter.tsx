'use client';

import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Users, GraduationCap, Building2, Calendar } from 'lucide-react';
import { fetchStats } from '@/lib/api';

const ICONS_MAP: Record<string, any> = {
  'Users': Users,
  'GraduationCap': GraduationCap,
  'Building2': Building2,
  'Calendar': Calendar,
  '0': Users,
  '1': GraduationCap,
  '2': Building2,
  '3': Calendar,
};

const COLORS = ['#169645', '#F4B41A', '#169645', '#F4B41A'];

const DEFAULT_STATS = [
  { label: 'Jumlah Santri', value: 850, icon: 'Users', suffix: '+' },
  { label: 'Jumlah Pengajar', value: 45, icon: 'GraduationCap', suffix: '+' },
  { label: 'Unit Pendidikan', value: 6, icon: 'Building2', suffix: '' },
  { label: 'Tahun Berdiri', value: 1988, icon: 'Calendar', suffix: '' },
];

export function StatsCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [statsData, setStatsData] = useState(DEFAULT_STATS);

  useEffect(() => {
    fetchStats()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any, i: number) => ({
            label: item.label,
            value: Number(item.value) || DEFAULT_STATS[i % DEFAULT_STATS.length].value,
            icon: item.icon || DEFAULT_STATS[i % DEFAULT_STATS.length].icon,
            suffix: item.label.toLowerCase().includes('tahun') ? '' : (item.label.toLowerCase().includes('unit') ? '' : '+'),
          }));
          setStatsData(formatted);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="py-16 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, i) => {
            const Icon = ICONS_MAP[stat.icon] || Users;
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={stat.label + i}
                className="group relative bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 card-hover overflow-hidden transition-all duration-300"
              >
                {/* Background blob */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{ background: color }}
                />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={24} style={{ color }} />
                </div>

                {/* Number */}
                <div className="text-4xl font-extrabold mb-1 font-mono" style={{ color }}>
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      separator="."
                      suffix={stat.suffix}
                      useEasing
                    />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>

                {/* Label */}
                <p className="text-gray-600 font-semibold text-sm">{stat.label}</p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: color }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
