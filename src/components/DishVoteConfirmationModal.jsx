import React, { useState, useEffect } from 'react';
import { Mail, CreditCard, AlertCircle, X } from 'lucide-react';

export default function DishVoteConfirmationModal({
  pkg,
  onClose,
  onSubmitVote
}) {
  if (!pkg) return null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [email, setEmail] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar las elecciones de platos / bebidas / guarniciones con los valores por defecto
  const [selections, setSelections] = useState(() => {
    const initial = {};
    if (pkg.selectableOptions && pkg.selectableOptions.length > 0) {
      pkg.selectableOptions.forEach((opt) => {
        initial[opt.id] = opt.defaultOption || opt.options[0];
      });
    }
    return initial;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !employeeCode.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!email.includes('@')) {
      setError('Ingresa un correo institucional válido (ej: nombre@cajaarequipa.pe)');
      return;
    }

    // Armar título detallado con las elecciones exactas del colaborador
    const selectedDetails = Object.values(selections).filter(Boolean);
    const formattedTitle =
      selectedDetails.length > 0
        ? `${pkg.title} (${selectedDetails.join(' • ')})`
        : pkg.title;

    // Extraer elecciones individuales para columnas dedicadas en base de datos
    const mainDishChoice = selections.mainDish || null;
    const sideDishChoice = selections.sideDish || null;
    const drinkChoice = selections.drink || selections.toast || null;
    const selectedDetailsText = Object.values(selections).filter(Boolean).join(' • ');

    setIsSubmitting(true);
    await onSubmitVote({
      email: email.trim().toLowerCase(),
      employeeCode: employeeCode.trim(),
      packageId: pkg.id,
      packageTitle: formattedTitle,
      selectedDish: mainDishChoice,
      selectedSide: sideDishChoice,
      selectedDrink: drinkChoice,
      selectedOptions: selectedDetailsText
    });
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-xl md:max-w-2xl rounded-3xl shadow-2xl border border-slate-200 my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con el fondo SVG de la pantalla principal (idéntico al modal de sede) */}
        <div
          className="p-5 sm:p-7 relative border-b border-slate-200 overflow-hidden"
          style={{
            backgroundColor: '#F4F7FB',
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(220, 248, 248, 0.9) 60%, rgba(1, 172, 173, 0.35) 100%), url('./Img/fondo.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'top right'
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center transition shadow-xs border border-slate-200/80 cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <h2 className="text-xl sm:text-2xl font-black text-[#002559] leading-tight">
            Confirmar Elección de Menú
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            Don Facu • Cena Navideña 2026
          </p>
        </div>

        {/* Resumen del Paquete Seleccionado amplio y cómodo en desktop */}
        <div className="p-5 sm:p-7 pb-2 sm:pb-3">
          <div className="bg-[#F4F7FB] border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-2xs">
            <img
              src="./donfacu/imagen (1).jpg"
              alt="Don Facu"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 bg-white border border-slate-200/80 shadow-xs"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base sm:text-lg font-black text-[#002559] truncate">
                  {pkg.title}
                </h3>
                <span className="text-base sm:text-lg font-black text-[#01ACAD] shrink-0">
                  {pkg.price}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-1">
                {pkg.highlight}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 pt-2 sm:pt-3 space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl flex items-center gap-2.5 font-bold text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Correo y Código de Trabajador en grid de 2 columnas amplio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-slate-900 mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <Mail className="w-4 h-4 text-[#01ACAD]" />
                Correo Institucional *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="ejemplo@cajaarequipa.pe"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:border-[#01ACAD] transition bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <CreditCard className="w-4 h-4 text-[#01ACAD]" />
                Código de Trabajador *
              </label>
              <input
                type="text"
                required
                value={employeeCode}
                onChange={(e) => {
                  setEmployeeCode(e.target.value);
                  setError('');
                }}
                placeholder="Ej: 84920"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:border-[#01ACAD] transition bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Opciones personalizables del paquete (Platos de fondo, cortes, bebidas y guarnición) */}
          {pkg.selectableOptions && pkg.selectableOptions.length > 0 && (
            <div className="space-y-4 bg-[#F4F7FB] border border-slate-200/90 rounded-2xl p-4 sm:p-5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD] block">
                Personaliza tu elección:
              </span>
              <div className="space-y-3.5">
                {pkg.selectableOptions.map((opt) => (
                  <div key={opt.id} className="space-y-1.5">
                    <label className="block font-black text-slate-800 text-xs sm:text-sm">
                      {opt.label}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.options.map((choice) => {
                        const isSelected = selections[opt.id] === choice;
                        return (
                          <button
                            key={choice}
                            type="button"
                            onClick={() =>
                              setSelections((prev) => ({ ...prev, [opt.id]: choice }))
                            }
                            className={`py-2 px-3 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer active:scale-95 text-left ${
                              isSelected
                                ? 'bg-[#002559] text-white border-[#002559] shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-[#01ACAD] hover:bg-slate-50'
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detalle de lo que incluye el paquete seleccionado en lista vertical limpia */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block">
              Platos incluidos en tu menú:
            </span>
            <div className="space-y-2 text-xs sm:text-sm">
              {pkg.dishes.map((d, idx) => (
                <div key={idx} className="text-slate-700 leading-snug">
                  <span className="font-bold text-slate-900">{d.label}: </span>
                  <span className="text-slate-600">{d.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de acción único y limpio (sin 'Cancelar' duplicado ni emojis) */}
          <div className="pt-2 sm:pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#002559] hover:bg-[#001c47] text-white font-black py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Guardando...' : 'Confirmar Voto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
