import React, { useEffect } from 'react';
import { X, CheckCircle2, DollarSign, Utensils, MapPin, Users, Award, ExternalLink } from 'lucide-react';

export default function ComparatorModal({
  selectedVenues,
  allVenues,
  onClose,
  onVote,
  onToggleCompare,
  userVote
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#002559] text-white p-5 sm:p-6 flex justify-between items-center border-b-2 border-[#01ACAD]">
          <div>
            <span className="text-[#01ACAD] text-xs font-black uppercase tracking-wider block">
              Herramienta de Evaluación
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Comparador de Sedes Navideñas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected venues pills bar */}
        <div className="bg-[#F4F7FB] px-5 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-extrabold text-[#002559]">Sedes en comparación:</span>
          {allVenues.map((v) => {
            const isSelected = selectedVenues.some((sv) => sv.id === v.id);
            return (
              <button
                key={v.id}
                onClick={() => onToggleCompare(v.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#002559] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#01ACAD]'
                }`}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Table / Grid */}
        <div className="flex-1 overflow-auto p-5 sm:p-6">
          {selectedVenues.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-base font-bold text-slate-700">No has seleccionado sedes para comparar.</p>
              <p className="text-xs text-slate-400 mt-1">
                Haz clic en las opciones superiores para agregar locales a la comparativa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedVenues.map((venue) => {
                const isVoted = userVote?.venueId === venue.id;
                return (
                  <div
                    key={venue.id}
                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between space-y-4 ${
                      isVoted ? 'border-[#01ACAD] ring-2 ring-[#01ACAD]/20 bg-[#01ACAD]/5' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Image & Title */}
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-white p-2 border border-slate-100 flex items-center justify-center">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-2 left-2 bg-[#002559]/90 text-[#01ACAD] text-[10px] font-black px-2.5 py-1 rounded-full">
                          {venue.badge}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-xs text-[#01ACAD] font-bold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{venue.zone}</span>
                        </div>
                        <h3 className="text-lg font-black text-[#002559]">{venue.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{venue.subtitle}</p>
                      </div>
                    </div>

                    {/* Quick Specs */}
                    <div className="space-y-2 text-xs">
                      <div className="bg-[#F4F7FB] p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Presupuesto</span>
                        <strong className="text-[#002559]">{venue.pricePerPerson || venue.priceRange}</strong>
                      </div>

                      <div className="bg-[#F4F7FB] p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Estilo & Menú</span>
                        <strong className="text-[#002559] block">{venue.style}</strong>
                        <p className="text-slate-600 text-[11px] mt-0.5">{venue.menu.main}</p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Lo más destacado:</span>
                        <ul className="space-y-1 text-slate-600 text-[11px]">
                          {venue.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#01ACAD] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Vote CTA Deshabilitado */}
                    <button
                      disabled
                      className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition shadow-sm ${
                        isVoted
                          ? 'bg-[#01ACAD] text-white opacity-100 cursor-default'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 opacity-60 select-none'
                      }`}
                      title="La votación oficial ha concluido"
                    >
                      {isVoted ? 'Elegido' : 'Votación Cerrada'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F4F7FB] p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-100 border border-slate-300 text-[#002559] font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Cerrar Comparador
          </button>
        </div>
      </div>
    </div>
  );
}
