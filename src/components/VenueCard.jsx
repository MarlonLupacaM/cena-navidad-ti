import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Maximize2, X, ExternalLink } from 'lucide-react';

export default function VenueCard({
  venue,
  totalVotes,
  userVote,
  onVoteClick,
  onDetailsClick,
  isLeader
}) {
  const images = venue.gallery && venue.gallery.length > 0 ? venue.gallery : [venue.image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isVotedByMe = userVote?.venueId === venue.id;
  const hasAlreadyVoted = Boolean(userVote);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation when image is enlarged
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  // Precargar las siguientes imágenes del carrusel para navegación instantánea
  useEffect(() => {
    if (images.length > 1) {
      const nextIdx = (currentIdx + 1) % images.length;
      const prevIdx = (currentIdx - 1 + images.length) % images.length;
      const img1 = new Image();
      img1.src = images[nextIdx];
      const img2 = new Image();
      img2.src = images[prevIdx];
    }
  }, [currentIdx, images]);

  return (
    <>
      <article
        className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col h-full ${
          isVotedByMe
            ? 'border-[#01ACAD] shadow-xl ring-2 ring-[#01ACAD]/30'
            : isLeader
            ? 'border-[#01ACAD]/70 shadow-lg hover:shadow-2xl'
            : 'border-slate-200 hover:border-[#01ACAD]/50 shadow-sm hover:shadow-lg'
        }`}
      >
        {/* Image Container: Carrusel interactivo totalmente libre, sin padding ni bordes, clic para agrandar */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative h-56 sm:h-60 w-full bg-white flex items-center justify-center overflow-hidden select-none cursor-zoom-in group/img"
          title="Clic para agrandar foto"
        >
          <img
            src={images[currentIdx]}
            alt={`${venue.name} - Foto ${currentIdx + 1}`}
            className="w-full h-full object-contain transition-all duration-300 group-hover/img:scale-[1.02]"
            loading="eager"
            decoding="async"
          />

          {/* Quick zoom icon indicator on hover */}
          <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition shadow-xs z-10 pointer-events-none">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>

          {/* Navigation Arrows: Sutiles en gris */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200/80 flex items-center justify-center transition shadow-xs hover:scale-105 active:scale-95 z-20"
                title="Foto anterior"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200/80 flex items-center justify-center transition shadow-xs hover:scale-105 active:scale-95 z-20"
                title="Siguiente foto"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>

      {/* Body Content: Simplificado y limpio */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-3.5">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#01ACAD] hover:text-[#002559] font-bold flex items-center gap-1 text-[10px] sm:text-[11px] transition hover:underline group/loc cursor-pointer"
              title="Abrir ubicación en Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 group-hover/loc:scale-110 transition-transform" />
              <span>{venue.zone}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/loc:opacity-100" />
            </a>
            <span className="text-[#002559] font-black text-[11px] sm:text-xs bg-[#F4F7FB] px-2 sm:px-2.5 py-0.5 rounded-lg border border-slate-200/80">
              {venue.pricePerPerson ? `S/ ${venue.pricePerPerson.replace('S/ ', '')}` : venue.priceRange}
            </span>
          </div>

          <h3 className="text-sm sm:text-lg font-black text-[#002559] leading-snug line-clamp-1">
            {venue.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
            {venue.style}
          </p>
        </div>

        {/* Action Buttons: Simples y directos */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onDetailsClick(venue)}
            className="flex-1 border border-slate-300 hover:border-[#01ACAD] hover:bg-slate-50 text-[#002559] font-bold py-2 px-3 rounded-xl text-xs transition active:scale-95"
          >
            Ver
          </button>

          <button
            disabled
            className={`flex-1 font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs ${
              isVotedByMe
                ? 'bg-[#01ACAD] text-white cursor-default opacity-100 font-black'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 select-none'
            }`}
            title="La votación oficial ha concluido"
          >
            {isVotedByMe ? 'Elegido' : 'Votación Cerrada'}
          </button>
        </div>
      </div>
    </article>

    {/* Lightbox: Imagen agrandada en pantalla completa con navegación */}
    {isLightboxOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
        onClick={() => setIsLightboxOpen(false)}
      >
        {/* Barra superior con título truncado y botón cerrar que NUNCA se solapan */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-6 flex items-center justify-between gap-2.5 sm:gap-4 z-30 pointer-events-none">
          {/* Título y contador de fotos */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md py-1.5 px-3 sm:px-4 rounded-2xl border border-white/15 min-w-0 max-w-[calc(100%-52px)] sm:max-w-xl text-white shadow-lg"
          >
            <span className="font-bold text-xs sm:text-base truncate text-slate-100">
              {venue.name}
            </span>
            {images.length > 1 && (
              <span className="text-[10px] sm:text-xs text-[#01ACAD] font-semibold bg-white/10 px-2 py-0.5 rounded-full shrink-0">
                {currentIdx + 1} de {images.length}
              </span>
            )}
          </div>

          {/* Botón Cerrar (libre, visible y con espacio garantizado sin solapamientos) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition shadow-lg shrink-0 border border-white/15 active:scale-95"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Previous Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition shadow-2xl hover:scale-110 active:scale-95 z-30"
            title="Foto anterior (←)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Enlarged Photo Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl max-h-[78vh] sm:max-h-[82vh] w-full flex items-center justify-center select-none mt-8 sm:mt-0"
        >
          <img
            src={images[currentIdx]}
            alt={`${venue.name} - Foto ampliada`}
            className="max-w-full max-h-[78vh] sm:max-h-[82vh] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-all duration-200"
          />
        </div>

        {/* Next Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition shadow-2xl hover:scale-110 active:scale-95 z-30"
            title="Siguiente foto (→)"
          >
            <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>
    )}
  </>
  );
}
