import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, Music, X } from 'lucide-react';

const PLAYLIST = [
  {
    id: 'burrito-sabanero',
    title: 'El Burrito Sabanero',
    sub: 'La Rondallita',
    src: './el-burrito-sabanero.mp3'
  },
  {
    id: 'toribianitos-popurri',
    title: 'Los Toribianitos',
    sub: 'Popurrí de Navidad Mix',
    src: './los-toribianitos-popurri-navidad.mp3'
  },
  {
    id: 'toribianitos',
    title: 'Los Toribianitos',
    sub: 'Villancicos Navideños',
    src: './los-toribianitos---letra-official-video.mp3'
  },
  {
    id: 'wham',
    title: 'Last Christmas',
    sub: 'Wham!',
    src: './last-christmas.mp3'
  }
];

export default function ChristmasAudioIntro() {
  const audioRef = useRef(null);
  const prevTrackIndexRef = useRef(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const AUDIO_VOLUME = 0.55;
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = AUDIO_VOLUME;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      // Avanzar al siguiente villancico automáticamente al terminar
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    // Intentar reproducir automáticamente desde el inicio
    const triggerAudio = () => {
      audio.volume = AUDIO_VOLUME;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            // El navegador restringe el sonido automático hasta el primer gesto del usuario
            console.log('Autoplay bloqueado por política del navegador:', err);

            const interactionEvents = [
              'pointerdown',
              'touchstart',
              'mousedown',
              'click',
              'keydown'
            ];

            const startOnInteraction = () => {
              audio.volume = AUDIO_VOLUME;
              audio.play()
                .then(() => {
                  setIsPlaying(true);
                  interactionEvents.forEach((evt) => {
                    window.removeEventListener(evt, startOnInteraction, true);
                    document.removeEventListener(evt, startOnInteraction, true);
                  });
                })
                .catch(() => {});
            };

            interactionEvents.forEach((evt) => {
              window.addEventListener(evt, startOnInteraction, { capture: true, passive: true });
              document.addEventListener(evt, startOnInteraction, { capture: true, passive: true });
            });
          });
      }
    };

    triggerAudio();

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Al cambiar de pista (solo si REALMENTE cambia el índice de la canción)
  useEffect(() => {
    if (prevTrackIndexRef.current === currentTrackIndex) {
      return;
    }
    prevTrackIndexRef.current = currentTrackIndex;

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();

    if (isPlaying) {
      audio.volume = AUDIO_VOLUME;
      audio.play().catch(() => {});
    }
  }, [currentTrackIndex, currentTrack.src, isPlaying]);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.volume = AUDIO_VOLUME;
      audio.play().catch((err) => {
        console.error('Error al reproducir audio:', err);
      });
    }
  };

  const handleNextTrack = (e) => {
    e.stopPropagation();
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);

    const audio = audioRef.current;
    if (audio) {
      audio.src = PLAYLIST[nextIdx].src;
      audio.load();
      audio.volume = AUDIO_VOLUME;
      audio.play().catch(() => {});
    }
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        autoPlay
        playsInline
        preload="metadata"
      />

      {/* Reproductor flotante con función de abrir y cerrar */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 select-none">
        
        {/* VISTA 1: BOTÓN CERRADO / MINIMIZADO (En la esquina izquierda) */}
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full shadow-xl border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
              isPlaying
                ? 'bg-white/95 border-[#01ACAD] text-[#002559] ring-2 ring-[#01ACAD]/30'
                : 'bg-white/95 border-slate-200 text-[#002559] hover:border-[#01ACAD]'
            }`}
            title="Abrir reproductor de música"
          >
            {isPlaying ? (
              // Ecualizador animado mientras suena
              <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
                <span className="w-1 bg-[#01ACAD] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3.5" />
                <span className="w-1 bg-[#E30613] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s] h-2.5" />
                <span className="w-1 bg-[#FFB800] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-3" />
              </div>
            ) : (
              <Music className="w-5 h-5 text-[#01ACAD]" />
            )}
          </button>
        ) : (
          
          /* VISTA 2: REPRODUCTOR ABIERTO */
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md border border-[#01ACAD]/40 shadow-2xl rounded-full p-1.5 sm:p-2 text-[#002559] animate-in fade-in zoom-in-95 duration-200">
            
            {/* 1. Botón CERRAR en la misma posición izquierda donde estaba el botón de abrir */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 active:scale-95 transition shrink-0"
              title="Cerrar reproductor"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 2. Título de la pista: al presionarlo también se cierra el reproductor */}
            <div
              onClick={() => setIsOpen(false)}
              className="cursor-pointer flex flex-col justify-center px-1 max-w-[115px] sm:max-w-[160px] leading-tight select-none"
              title="Toca para cerrar"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-black truncate text-[#002559]">
                  {currentTrack.title}
                </span>
                {isPlaying && (
                  <div className="flex items-center gap-0.5 shrink-0 h-2.5">
                    <span className="w-0.5 bg-[#01ACAD] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
                    <span className="w-0.5 bg-[#E30613] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s] h-1.5" />
                    <span className="w-0.5 bg-[#FFB800] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2" />
                  </div>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold truncate">
                {currentTrack.sub}
              </span>
            </div>

            {/* Separador fino */}
            <div className="h-5 w-px bg-slate-200 mx-0.5" />

            {/* 3. Controles a la DERECHA: Play/Pausa, Siguiente, Silenciar */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              
              {/* Botón Play / Pause (único botón que pausa/reproduce) */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-[#01ACAD] text-white shadow-md'
                    : 'bg-[#002559] text-white hover:bg-[#01ACAD]'
                }`}
                title={isPlaying ? "Pausar música" : "Reproducir música"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Botón Siguiente pista (⏭) */}
              <button
                type="button"
                onClick={handleNextTrack}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-[#01ACAD] hover:bg-slate-100 active:bg-slate-200 transition"
                title="Siguiente villancico"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Botón Silenciar / Activar sonido */}
              <button
                type="button"
                onClick={handleToggleMute}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-[#002559] hover:bg-slate-100 active:bg-slate-200 transition"
                title={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

            </div>

          </div>
        )}
      </div>
    </>
  );
}
