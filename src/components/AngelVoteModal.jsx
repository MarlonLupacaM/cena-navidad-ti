import React, { useState, useEffect } from 'react';
import { Mail, CreditCard, AlertCircle, X, CheckCircle2, Gift } from 'lucide-react';

export default function AngelVoteModal({
  onClose,
  onSubmitVote,
  existingVote
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [email, setEmail] = useState(existingVote?.email || '');
  const [employeeCode, setEmployeeCode] = useState(existingVote?.employeeCode || '');
  const [giftSuggestion, setGiftSuggestion] = useState(existingVote?.giftSuggestion || '');
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
        giftSuggestion: giftSuggestion.trim()
      });
    } catch (err) {
      setError('Ocurrió un error al registrar tu participación.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con estilo Caja Arequipa */}
        <div
          className="p-5 sm:p-6 relative border-b border-slate-200 overflow-hidden"
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
            className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center transition shadow-xs border border-slate-200/80 cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD] block">
              Dinámica Oficial
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#002559]">
              {existingVote ? 'Editar mi Sugerencia' : 'Inscripción al Juego del Ángel'}
            </h2>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Campo: Correo Institucional */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
              Correo Institucional <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:bg-white text-slate-800 transition"
              />
            </div>
          </div>

          {/* Campo: Código de Colaborador */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
              Código de Colaborador <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-4 h-4" />
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:bg-white text-slate-800 transition"
              />
            </div>
          </div>

          {/* Campo: Sugerencia de Compra / Regalo Principal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                ¿Qué te gustaría de regalo principal? <span className="text-slate-400 font-normal">(S/ 50)</span>
              </label>
              <span className="text-[10px] font-bold text-[#01ACAD] uppercase tracking-wider">
                Opcional
              </span>
            </div>
            <div>
              <textarea
                rows={2}
                value={giftSuggestion}
                onChange={(e) => setGiftSuggestion(e.target.value)}
                placeholder="Ej. Taza térmica, libro, chocolates finos, audífonos, prenda talla M, etc."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#01ACAD] focus:bg-white text-slate-800 transition resize-none"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-98"
            >
              {isSubmitting ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{existingVote ? 'Actualizar Datos' : 'Confirmar Inscripción'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
