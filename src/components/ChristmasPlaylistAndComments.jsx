import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Heart, CheckCircle2, Sparkles, Pin } from 'lucide-react';
import { getLiveComments, insertComment, toggleCommentLike, getOrCreateDeviceId } from '../lib/supabase';

const POSTIT_COLORS = [
  {
    id: 'yellow',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-950',
    tape: 'bg-amber-200/80',
    shadow: 'shadow-amber-200/50'
  },
  {
    id: 'pink',
    bg: 'bg-rose-100',
    border: 'border-rose-300',
    text: 'text-rose-950',
    tape: 'bg-rose-200/80',
    shadow: 'shadow-rose-200/50'
  },
  {
    id: 'cyan',
    bg: 'bg-cyan-100',
    border: 'border-cyan-300',
    text: 'text-cyan-950',
    tape: 'bg-cyan-200/80',
    shadow: 'shadow-cyan-200/50'
  },
  {
    id: 'green',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    text: 'text-emerald-950',
    tape: 'bg-emerald-200/80',
    shadow: 'shadow-emerald-200/50'
  },
  {
    id: 'purple',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-950',
    tape: 'bg-purple-200/80',
    shadow: 'shadow-purple-200/50'
  }
];

const ROTATIONS = [
  '-rotate-2',
  'rotate-1',
  '-rotate-1',
  'rotate-2',
  'rotate-0',
  '-rotate-3',
  'rotate-3'
];

const INITIAL_NOTES = [
  {
    id: 1,
    type: 'deseo',
    text: '¡Que esta cena navideña sea una noche inolvidable para celebrar todos los logros y el esfuerzo de este año en equipo!',
    colorIdx: 0,
    rotation: '-rotate-2',
    time: 'Hace un momento'
  },
  {
    id: 2,
    type: 'deseo',
    text: 'Deseo que pasemos un momento lindo compartiendo juntos, bailando y despidiendo este gran año con la mejor energía.',
    colorIdx: 1,
    rotation: 'rotate-2',
    time: 'Hace un momento'
  },
  {
    id: 3,
    type: 'deseo',
    text: '¡Muchos éxitos para el próximo año! A disfrutar nuestra cena navideña al máximo con toda la buena vibra.',
    colorIdx: 2,
    rotation: '-rotate-1',
    time: 'Hace un momento'
  }
];

function parseNoteContent(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { isList: false, text: rawText || '' };
  }

  const trimmed = rawText.trim();

  // 1. Detectar listas multilinea (líneas que inician con 1., 1), -, *, •)
  const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 2) {
    const listPattern = /^(\d{1,2}[\.\)]|[-*•])\s+(.+)$/;
    const listMatches = lines.filter((l) => listPattern.test(l));

    if (listMatches.length >= 2 && listMatches.length >= lines.length - 1) {
      let header = '';
      const items = [];
      lines.forEach((line) => {
        const match = line.match(listPattern);
        if (match) {
          const marker = match[1].replace(/[-*•]/, '•');
          items.push({ marker, content: match[2].trim() });
        } else if (items.length === 0) {
          header = line;
        } else {
          items.push({ marker: '•', content: line });
        }
      });
      return { isList: true, header, items };
    }
  }

  // 2. Detectar listas numeradas continuas/en una sola línea (ej. "Mi lista 1. item 2. item 3. item")
  const inlineRegex = /(?:^|\s)(\d{1,2})[\.\)]\s+/g;
  const matches = [...trimmed.matchAll(inlineRegex)];

  if (matches.length >= 2) {
    const firstNum = parseInt(matches[0][1], 10);
    if (firstNum === 1 || matches.length >= 3) {
      const firstMatchIndex = matches[0].index + (matches[0][0].startsWith(' ') ? 1 : 0);
      const header = trimmed.substring(0, firstMatchIndex).trim();

      const items = [];
      for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        const num = currentMatch[1];
        const startIndex = currentMatch.index + currentMatch[0].length;
        const endIndex = i + 1 < matches.length ? matches[i + 1].index : trimmed.length;
        const itemText = trimmed.substring(startIndex, endIndex).trim();
        if (itemText) {
          items.push({ marker: `${num}.`, content: itemText });
        }
      }

      if (items.length >= 2) {
        return { isList: true, header, items };
      }
    }
  }

  return { isList: false, text: trimmed };
}

export default function ChristmasPlaylistAndComments() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('caja_muro_postits_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const missingInitials = INITIAL_NOTES.filter(
            (init) => !parsed.some((p) => p.text === init.text || p.id === init.id)
          );
          return [...parsed, ...missingInitials];
        }
      }
      return INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [type, setType] = useState('deseo');
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModerationSuccessModal, setShowModerationSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 8;

  // Ordenar notas: la nota con mayor cantidad de likes (mínimo 1) queda fijada arriba en primer lugar
  const { sortedNotes, pinnedNoteId } = useMemo(() => {
    if (!notes || notes.length === 0) return { sortedNotes: [], pinnedNoteId: null };

    // Buscar la nota con el máximo de likes (si tiene al menos 1 like)
    let maxLikes = 0;
    let bestId = null;

    notes.forEach((n) => {
      const lk = n.likes || 0;
      if (lk > maxLikes) {
        maxLikes = lk;
        bestId = n.id;
      }
    });

    if (maxLikes > 0 && bestId !== null) {
      const topNote = notes.find((n) => n.id === bestId);
      const rest = notes.filter((n) => n.id !== bestId);
      return {
        sortedNotes: [topNote, ...rest],
        pinnedNoteId: bestId
      };
    }

    return { sortedNotes: notes, pinnedNoteId: null };
  }, [notes]);

  const totalPages = Math.ceil(sortedNotes.length / ITEMS_PER_PAGE) || 1;
  const visibleNotes = sortedNotes.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  useEffect(() => {
    try {
      localStorage.setItem('caja_muro_postits_v4', JSON.stringify(notes));
    } catch {
      // quota fallback
    }
  }, [notes]);

  // Sincronización en vivo con Supabase para el muro de post-its
  useEffect(() => {
    let isMounted = true;
    const deviceId = getOrCreateDeviceId();

    const syncComments = async () => {
      const liveData = await getLiveComments();
      if (!isMounted || !Array.isArray(liveData)) return;

      const formatted = liveData.map((item, idx) => {
        const likesArr = Array.isArray(item.comment_likes) ? item.comment_likes : [];
        const likesCount = likesArr.length;
        const likedByMe = likesArr.some((l) => l.device_id === deviceId);

        return {
          id: item.id,
          type: item.type || 'deseo',
          text: item.text,
          colorIdx: typeof item.color_idx === 'number' ? item.color_idx : idx % POSTIT_COLORS.length,
          rotation: item.rotation || 'rotate-0',
          likes: likesCount,
          likedByMe,
          time: item.created_at
            ? new Date(item.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
            : 'Hace un momento'
        };
      });

      // Las notas aprobadas de la BD van primero y las 3 notas iniciales siempre se preservan
      const merged = [
        ...formatted.filter((f) => !INITIAL_NOTES.some((init) => init.id === f.id || init.text === f.text)),
        ...INITIAL_NOTES.map((init) => ({
          ...init,
          likes: typeof init.likes === 'number' ? init.likes : 0,
          likedByMe: Boolean(init.likedByMe)
        }))
      ];

      setNotes(merged);
      try {
        localStorage.setItem('caja_muro_postits_v4', JSON.stringify(merged));
      } catch {}
    };

    syncComments();
    const interval = setInterval(syncComments, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleToggleLike = async (noteId) => {
    // Si es nota inicial local o temporal
    if (typeof noteId === 'string' && noteId.startsWith('temp-')) return;

    // Actualización optimista inmediata en UI
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          const newLiked = !n.likedByMe;
          const newCount = newLiked ? (n.likes || 0) + 1 : Math.max(0, (n.likes || 0) - 1);
          return { ...n, likedByMe: newLiked, likes: newCount };
        }
        return n;
      })
    );

    // Persistir like en Supabase
    await toggleCommentLike(noteId);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const randomRot = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
    const noteText = text.trim();
    const noteColor = selectedColor;
    const noteType = type;

    setText('');
    setSelectedColor((prev) => (prev + 1) % POSTIT_COLORS.length);
    setIsModalOpen(false);

    // Guardado en Supabase (desactivado por defecto hasta aprobación manual)
    await insertComment({
      type: noteType,
      text: noteText,
      colorIdx: noteColor,
      rotation: randomRot
    });

    // Abrir modal elegante de confirmación de moderación
    setShowModerationSuccessModal(true);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-slate-100">
        <div>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD] block mb-1">
            Comunidad de Caja Arequipa
          </span>
          <h3 className="text-lg sm:text-2xl font-black text-[#002559]">
            Muro de Deseos y Opiniones
          </h3>
        </div>

        {/* Top Controls: Navegación de páginas con flechitas y botón Agregar */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 bg-[#F4F7FB] border border-slate-200 px-2 py-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={handlePrevPage}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-2xs active:scale-95 cursor-pointer"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>

              <span className="text-[11px] font-black text-[#002559] px-2 select-none">
                {currentPage + 1} / {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-2xs active:scale-95 cursor-pointer"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#002559] hover:bg-[#001c47] text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#01ACAD]" />
            <span>Agregar comentario</span>
          </button>
        </div>
      </div>

      {/* Tablero de Corcho con Post-its: Exactamente 8 por página (2 filas de 4) */}
      <div
        className="relative rounded-3xl p-5 sm:p-7 min-h-[440px] border-4 border-[#8B5A2B]/40 shadow-inner overflow-hidden"
        style={{
          backgroundColor: '#DEB887',
          backgroundImage: `
            radial-gradient(#C69255 15%, transparent 16%),
            radial-gradient(#B8860B 15%, transparent 16%),
            linear-gradient(45deg, rgba(160, 106, 40, 0.15) 25%, transparent 25%, transparent 75%, rgba(160, 106, 40, 0.15) 75%),
            linear-gradient(45deg, rgba(160, 106, 40, 0.15) 25%, transparent 25%, transparent 75%, rgba(160, 106, 40, 0.15) 75%)
          `,
          backgroundSize: '24px 24px, 24px 24px, 40px 40px, 40px 40px',
          backgroundPosition: '0 0, 12px 12px, 0 0, 20px 20px'
        }}
      >
        {/* Post-its Grid: Cuadrícula fija de hasta 8 elementos sin scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleNotes.map((note) => {
            const color = POSTIT_COLORS[note.colorIdx % POSTIT_COLORS.length];
            const isDeseo = note.type === 'deseo';
            const isPinned = note.id === pinnedNoteId;
            const parsed = parseNoteContent(note.text);

            return (
              <div
                key={note.id}
                className={`relative ${color.bg} ${color.text} ${color.border} border p-4 pt-5 pb-8 rounded-xs shadow-lg ${color.shadow} transform ${note.rotation} hover:rotate-0 hover:scale-105 transition-all duration-200 flex flex-col justify-between min-h-[185px] sm:min-h-[200px] select-none ${
                  isPinned ? 'ring-2 ring-amber-500/50 shadow-xl' : ''
                }`}
                style={{
                  boxShadow: '0 8px 18px rgba(0,0,0,0.16), 0 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                {/* Chincheta roja clásica */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-red-600 shadow-md border border-white flex items-center justify-center z-10">
                  <div className="w-1 h-1 rounded-full bg-white opacity-80" />
                </div>

                {/* Badge Fijado Destacado si es el más votado */}
                {isPinned && (
                  <div className="absolute -top-2.5 -right-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-20 border border-white/80 animate-in fade-in duration-300">
                    <Pin className="w-2.5 h-2.5 fill-current" />
                    <span>Fijado</span>
                  </div>
                )}

                {/* Tape sutil en esquina (solo si no está el pin badge) */}
                {!isPinned && (
                  <div
                    className={`absolute top-0 right-3 w-7 h-3 ${color.tape} opacity-70 -rotate-6`}
                  />
                )}

                {/* Encabezado del Post-it y Contenido */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-2 border-b border-black/10 pb-1 shrink-0">
                    <span className="opacity-90 flex items-center gap-1">
                      {isDeseo ? 'Deseo' : 'Opinión'}
                    </span>
                    <span className="opacity-60 text-[9px] font-medium">{note.time}</span>
                  </div>

                  {/* Contenido (Lista estructurada o Párrafo) */}
                  <div className="flex-1 overflow-y-auto max-h-[220px] sm:max-h-[250px] pr-1 select-text">
                    {parsed.isList ? (
                      <div>
                        {parsed.header && (
                          <p className="font-bold text-xs sm:text-[13px] text-slate-900 mb-1.5 pb-0.5 border-b border-black/10">
                            {parsed.header}
                          </p>
                        )}
                        <ul className="space-y-1">
                          {parsed.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs sm:text-[12.5px] leading-snug">
                              <span className="font-bold opacity-75 shrink-0 text-[11px] sm:text-xs min-w-[16px]">
                                {item.marker}
                              </span>
                              <span className="break-words font-medium">{item.content}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-[13px] font-medium leading-relaxed font-sans text-slate-800 whitespace-pre-line">
                        "{note.text}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Espacio inferior libre del Post-it con botón de Corazón interactivo */}
                <div className="mt-3 pt-2 relative flex items-center justify-between border-t border-black/5 shrink-0">
                  {/* Botón de Like / Corazón antispam */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(note.id);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-black transition-all duration-200 cursor-pointer active:scale-90 ${
                      note.likedByMe
                        ? 'bg-rose-500/15 text-rose-600'
                        : 'bg-black/5 text-slate-700 hover:bg-black/10'
                    }`}
                    title={note.likedByMe ? 'Ya no me gusta' : 'Me gusta'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform ${
                        note.likedByMe
                          ? 'fill-rose-500 text-rose-500 scale-110'
                          : 'text-slate-600 hover:text-rose-500'
                      }`}
                    />
                    <span>{note.likes || 0}</span>
                  </button>

                  {/* Sutil pestaña/sombra de despegue de la esquina del post-it */}
                  <div className="w-4 h-4 bg-black/5 rounded-tl-sm opacity-40" />
                </div>
              </div>
            );
          })}
        </div>

        {notes.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center text-[#5C3A1E]">
            <p className="font-bold text-sm">No hay notas en el tablero aún.</p>
            <p className="text-xs opacity-80 mt-1">Usa el botón "Agregar comentario" para dejar una.</p>
          </div>
        )}
      </div>

      {/* Fin del tablero */}

      {/* Modal para Agregar Comentario */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#01ACAD] block">
                  Comunidad Caja Arequipa
                </span>
                <h4 className="text-base font-black text-[#002559]">
                  Publicar en el Muro
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3.5 text-xs">
              {/* Selector de Tipo */}
              <div>
                <label className="block font-bold text-[#002559] mb-1.5">
                  Tipo de publicación:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('deseo')}
                    className={`py-2 px-3 rounded-xl font-bold border transition text-center cursor-pointer ${
                      type === 'deseo'
                        ? 'bg-rose-100 border-rose-400 text-rose-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Deseo
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('opinion')}
                    className={`py-2 px-3 rounded-xl font-bold border transition text-center cursor-pointer ${
                      type === 'opinion'
                        ? 'bg-cyan-100 border-cyan-400 text-cyan-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Opinión
                  </button>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block font-bold text-[#002559] mb-1">
                  Mensaje:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    type === 'deseo'
                      ? 'Escribe tu deseo o saludo para el equipo...'
                      : 'Escribe tu opinión constructiva sobre los locales...'
                  }
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#01ACAD] resize-none text-slate-900"
                />
              </div>

              {/* Color del Post-it */}
              <div>
                <label className="block font-bold text-[#002559] mb-1.5">
                  Color del post-it:
                </label>
                <div className="flex items-center gap-2">
                  {POSTIT_COLORS.map((col, idx) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(idx)}
                      className={`w-7 h-7 rounded-xl ${col.bg} ${col.border} border-2 transition transform hover:scale-110 cursor-pointer ${
                        selectedColor === idx ? 'ring-2 ring-[#002559] scale-110 shadow-xs' : 'opacity-80'
                      }`}
                      title={col.id}
                    />
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#002559] hover:bg-[#001c47] text-white font-bold py-2 px-3 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
                >
                  Publicar Post-it
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal elegante: Mensaje enviado a moderación */}
      {showModerationSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowModerationSuccessModal(false)}
        >
          <div
            className="relative bg-white w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar esquina */}
            <button
              onClick={() => setShowModerationSuccessModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icono Badge Elegante */}
            <div className="w-14 h-14 rounded-2xl bg-[#E8F9F9] border border-[#01ACAD]/30 flex items-center justify-center text-[#01ACAD] mb-4 shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            {/* Título */}
            <h3 className="text-xl font-black text-[#002559] tracking-tight">
              ¡Mensaje Recibido!
            </h3>

            {/* Descripción suave y minimalista */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
              Tu post-it fue enviado con éxito. Se publicará en el muro en breve tras la moderación.
            </p>

            {/* Pill decorativa */}
            <div className="inline-flex items-center gap-1.5 bg-[#F4F7FB] border border-slate-200 rounded-full px-3 py-1 mt-4 text-[11px] font-bold text-[#002559]">
              <Sparkles className="w-3.5 h-3.5 text-[#01ACAD]" />
              <span>Gracias por compartir con el equipo</span>
            </div>

            {/* Botón Aceptar */}
            <button
              type="button"
              onClick={() => setShowModerationSuccessModal(false)}
              className="w-full mt-5 bg-[#002559] hover:bg-[#001c47] text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md active:scale-95 cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

