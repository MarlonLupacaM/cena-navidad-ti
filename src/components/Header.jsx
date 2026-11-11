import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Header({
  totalVotes
}) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), 10, 23, 59, 59);
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth(), 10, 23, 59, 59);
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className="relative text-white shadow-xl overflow-hidden border-b-4 border-[#01ACAD]"
      style={{
        backgroundColor: '#002559',
        backgroundImage:
          'linear-gradient(135deg, #001435 0%, #002559 45%, #005175 80%, #01ACAD 100%)'
      }}
    >
      {/* Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          {/* Logo & Title */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center">
              <img
                src="./Img/logo.png"
                alt="Caja Arequipa"
                className="h-11 sm:h-16 md:h-20 w-auto object-contain drop-shadow-md"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                Elige tu Cena Navideña
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed font-medium">
                Vota por tu local favorito para celebrar juntos este fin de año.
              </p>
            </div>
          </div>

          {/* Countdown timer cerrado / tiempo finalizado */}
          <div className="flex flex-col items-center justify-center shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl border border-white/15 shadow-sm w-auto self-start sm:self-center text-center">
            <span className="text-[10px] sm:text-xs text-white/95 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1 sm:mb-1.5">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#01ACAD]" /> Votación Finalizada
            </span>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white">
              <span className="text-xs sm:text-sm font-black bg-white/20 text-white px-3 py-1 rounded-lg tracking-wide uppercase border border-white/20">
                Periodo concluido el 10 de noviembre
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
