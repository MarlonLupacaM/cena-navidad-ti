import React from 'react';
import { Clock } from 'lucide-react';

export default function Header() {

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

          {/* Indicador minimalista de votación finalizada */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/15 shadow-xs self-start sm:self-center text-white">
            <Clock className="w-3.5 h-3.5 text-[#01ACAD] shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide whitespace-nowrap">
              Votación cerrada (10 de nov)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
