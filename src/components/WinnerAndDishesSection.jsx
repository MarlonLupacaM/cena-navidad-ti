import React from 'react';
import {
  Utensils,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { DON_FACU_PACKAGES } from '../data/dishPackages';

export default function WinnerAndDishesSection({
  dishVotes,
  userDishVote,
  onVoteDishClick,
  onViewDonFacuDetails
}) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* BANNER GANADOR TOTALMENTE RESPONSIVO EN MÓVIL Y DESKTOP */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#001435] text-white shadow-xl border border-white/10 min-h-[150px] sm:min-h-[190px] flex items-center">
        {/* Mitad derecha: Imagen del restaurante con degradado que protege la legibilidad en móvil */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 sm:w-1/2 overflow-hidden pointer-events-none">
          <img
            src="./donfacu/imagen (1).jpg"
            alt="Don Facu"
            className="w-full h-full object-cover object-center"
          />
          {/* Degradado responsivo: 100% opaco a la izquierda para garantizar lectura limpia en pantallas angostas */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001435] via-[#001435]/90 sm:via-[#001435]/60 to-transparent" />
        </div>

        {/* Contenido del banner: adaptado armónicamente para pantallas móviles y desktop */}
        <div className="relative z-10 w-full sm:w-4/5 p-3.5 sm:p-7 flex items-center gap-3 sm:gap-6">
          {/* Bloque fecha compacto en móvil, amplio en desktop */}
          <div className="shrink-0 flex flex-col items-center justify-center text-center text-white border-r border-white/20 pr-3 sm:pr-6 select-none">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD]">
              Diciembre
            </span>
            <span className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tight mt-0.5 sm:mt-1">
              04
            </span>
          </div>

          {/* Datos de la sede al lado */}
          <div className="flex flex-col justify-center space-y-0.5 sm:space-y-1 min-w-0 pr-2">
            <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#01ACAD] truncate">
              Sede Ganadora Oficial
            </span>

            <h1 className="text-lg sm:text-3xl font-extrabold text-white tracking-tight leading-tight truncate">
              Don Facu
            </h1>

            <a
              href="https://www.google.com/maps/place/Don+Facu+-+Peruvian+Steakhouse/@-16.3887627,-71.548565,17z/data=!3m1!4b1!4m6!3m5!1s0x91424b0069abf097:0xd9e0c1551e7847db!8m2!3d-16.3887627!4d-71.5459901!16s%2Fg%2F11vplbh0yh?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              title="Ver ubicación en Google Maps"
              className="inline-flex items-center gap-1 text-[11px] sm:text-sm text-slate-300 font-medium hover:text-[#01ACAD] transition-colors group w-fit"
            >
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#01ACAD] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="underline decoration-slate-500/60 underline-offset-2 group-hover:decoration-[#01ACAD] truncate max-w-[155px] xs:max-w-[210px] sm:max-w-none">
                Calle Tronchadero 307, Cayma
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 🍽️ SECCIÓN DE VOTACIÓN DE PLATOS */}
      <section className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD] mb-0.5">
              <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Fase 2 de la Elección</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#002559] leading-snug">
              Elige tu Paquete Navideño de Comida
            </h2>
          </div>

          {/* Indicador solo si el usuario ya votó */}
          {userDishVote && (
            <div className="self-start sm:self-center flex items-center gap-2">
              <div className="bg-[#E8F9F9] border border-[#01ACAD] text-[#002559] px-3 sm:px-3.5 py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#01ACAD] shrink-0" />
                <span>Ya votaste por: {userDishVote.packageTitle || 'Tu menú'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Grid de los 4 Paquetes Navideños: 1x1 en móvil y 2x2 en pantallas medianas/grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {DON_FACU_PACKAGES.map((pkg) => {
            const isVotedByMe = userDishVote?.packageId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 p-4 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isVotedByMe
                    ? 'border-[#01ACAD] ring-3 ring-[#01ACAD]/20 shadow-lg'
                    : 'border-slate-200/90 hover:border-[#01ACAD]/50'
                }`}
              >
                {/* Header de la tarjeta del paquete */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-base sm:text-lg font-black text-[#002559] leading-snug">
                      {pkg.title}
                    </h3>
                    <span className="text-base sm:text-lg font-black text-[#002559] shrink-0">
                      {pkg.price}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-[#01ACAD] mb-3">
                    {pkg.highlight}
                  </p>

                  {/* Lista de platos incluidos en el paquete */}
                  <div className="space-y-2.5 sm:space-y-3 border-t border-slate-100 pt-3">
                    {pkg.dishes.map((d, i) => (
                      <div key={i} className="text-slate-600 leading-snug">
                        <span className="text-[10px] sm:text-xs uppercase font-black tracking-wide text-slate-400 block mb-0.5">
                          {d.label}:
                        </span>
                        <span className="font-semibold text-slate-800 text-xs sm:text-sm leading-snug block">
                          {d.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Votación */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onVoteDishClick(pkg)}
                    disabled={Boolean(userDishVote)}
                    className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                      isVotedByMe
                        ? 'bg-[#01ACAD] text-white cursor-default'
                        : userDishVote
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none'
                        : 'bg-[#002559] hover:bg-[#001c47] text-white'
                    }`}
                  >
                    {isVotedByMe ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Elegido por ti</span>
                      </>
                    ) : userDishVote ? (
                      <span>Votado</span>
                    ) : (
                      <>
                        <Utensils className="w-3.5 h-3.5 text-[#01ACAD]" />
                        <span>Votar por este Menú</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
