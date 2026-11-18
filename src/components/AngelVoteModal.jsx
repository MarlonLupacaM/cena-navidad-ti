import React, { useState, useEffect } from 'react';
import { Mail, CreditCard, AlertCircle, X, CheckCircle2, XCircle, Info } from 'lucide-react';

export default function AngelVoteModal({
  onClose,
  onSubmitVote,
  existingVote,
  initialChoice = 'yes'
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [willParticipate, setWillParticipate] = useState(() => {
    if (typeof initialChoice === 'boolean') return initialChoice;
    if (initialChoice === 'no') return false;
    if (initialChoice === 'yes') return true;
    if (existingVote && (existingVote.willParticipate === false || existingVote.giftSuggestion === '[NO PARTICIPA]')) {
      return false;
    }
    return true;
  });

  const [email, setEmail] = useState(existingVote?.email || '');
  const [employeeCode, setEmployeeCode] = useState(existingVote?.employeeCode || '');
  const [giftSuggestion, setGiftSuggestion] = useState(() => {
    if (existingVote?.giftSuggestion === '[NO PARTICIPA]') return '';
    return existingVote?.giftSuggestion || '';
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !employeeCode.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!email.includes('@')) {
      setError('Ingresa un correo institucional válido (ej: nombre@cajaarequipa.pe)');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitVote({
        email: email.trim().toLowerCase(),
        employeeCode: employeeCode.trim(),
        giftSuggestion: willParticipate ? giftSuggestion.trim() : '[NO PARTICIPA]',
        willParticipate
      });
    } catch (err) {
      setError('Ocurrió un error al registrar tu respuesta.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con estilo Caja Arequipa */}
        <div
          className="p-4 sm:p-6 relative border-b border-slate-200 overflow-hidden pr-12"
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
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center transition shadow-xs border border-slate-200/80 cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD] block">
              Dinámica Oficial
            </span>
            <h2 className="text-base sm:text-xl font-black text-[#002559] leading-snug">
              {existingVote
                ? 'Editar mi Respuesta'
                : willParticipate
                ? 'Inscripción al Juego del Ángel'
                : 'Confirmar No Participación'}
            </h2>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {/* Selector de Decisión: Participar vs No Participar */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
              Tu Decisión:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setWillParticipate(true)}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  willParticipate
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Sí participaré</span>
              </button>

              <button
                type="button"
                onClick={() => setWillParticipate(false)}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !willParticipate
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>No voy a participar</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Campo: Correo Institucional */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
              Correo Institucional <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setError('');
                  setEmail(e.target.value);
                }}
                placeholder="ejemplo@cajaarequipa.pe"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:bg-white text-slate-800 transition"
              />
            </div>
          </div>

          {/* Campo: Código de Colaborador */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
              Código de Colaborador <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <input
                type="text"
                required
                value={employeeCode}
                onChange={(e) => {
                  setError('');
                  setEmployeeCode(e.target.value);
                }}
                placeholder="Ej. C12345"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:bg-white text-slate-800 transition"
              />
            </div>
          </div>

          {/* Si participa: Campo Sugerencia de Compra / Regalo Principal */}
          {willParticipate ? (
            <div>
              <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                <label className="block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wide">
                  ¿Qué te gustaría de regalo principal? <span className="text-slate-400 font-normal">(S/ 50)</span>
                </label>
                <span className="text-[10px] font-bold text-[#01ACAD] uppercase tracking-wider shrink-0">
                  Opcional
                </span>
              </div>
              <div>
                <textarea
                  rows={2}
                  value={giftSuggestion}
                  onChange={(e) => setGiftSuggestion(e.target.value)}
                  placeholder="Ej. Taza térmica, libro, chocolates, etc."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:bg-white text-slate-800 transition resize-none leading-relaxed"
                />
              </div>
            </div>
          ) : (
            /* Si NO participa: Nota informativa */
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                Registraremos que no participarás para no asignarte ningún amigo secreto en el sorteo. Si luego cambias de opinión, podrás unirte antes del inicio.
              </span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-1.5 flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer active:scale-98 ${
                willParticipate
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              {isSubmitting ? (
                <span>Guardando...</span>
              ) : willParticipate ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{existingVote ? 'Actualizar Datos' : 'Confirmar Inscripción'}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Registrar No Participación</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
