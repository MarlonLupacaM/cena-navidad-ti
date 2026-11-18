import React from 'react';
import {
  Gift,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck,
  Package,
  HeartHandshake,
  Scale
} from 'lucide-react';

export default function SecretAngelSection({
  userAngelVote,
  onOpenVoteModal,
  onChangeVote
}) {
  const hasVoted = Boolean(userAngelVote);
  const isNotParticipating = Boolean(
    userAngelVote &&
    (userAngelVote.willParticipate === false || userAngelVote.giftSuggestion === '[NO PARTICIPA]')
  );

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* 1. Hero Minimalista */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD] block">
              Dinámica Navideña Oficial
            </span>

            <h2 className="text-xl sm:text-3xl font-black text-[#002559] tracking-tight">
              Juego del Ángel Navideño
            </h2>
          </div>
        </div>
      </div>

      {/* 2. Tarjetas en 2 Filas: Regalos Pequeños (S/ 5) y Regalo Principal (S/ 50) */}
      <section className="space-y-6 sm:space-y-8">
        {/* Fila 1: Regalos Pequeños (S/ 5) - Data a la IZQUIERDA (50%), Cóndor GRANDE a la DERECHA (50%) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-10 relative overflow-hidden">
          {/* Data a la izquierda */}
          <div className="space-y-4 text-left w-full">
            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD]">
                Entregas Diarias
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#002559]">
                Regalos Pequeños
              </h3>
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full">
                <span>Mínimo:</span>
                <span className="text-amber-700 text-base sm:text-lg">S/ 5.00</span>
              </div>
            </div>

            {/* Días de Entrega: 3 columnas en Fila 1 y 2 centradas en Fila 2 */}
            <div className="pt-2">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2.5">
                Días de Entrega:
              </span>
              <div className="grid grid-cols-6 gap-2.5">
                {[
                  { dayNum: 'Día 1', date: '01 Dic' },
                  { dayNum: 'Día 2', date: '03 Dic' },
                  { dayNum: 'Día 3', date: '10 Dic' },
                  { dayNum: 'Día 4', date: '15 Dic', customClass: 'col-start-2' },
                  { dayNum: 'Día 5', date: '17 Dic' }
                ].map((item) => (
                  <div
                    key={item.dayNum}
                    className={`col-span-2 p-2.5 sm:p-3 rounded-2xl bg-[#F4F7FB] border border-slate-200/90 text-center space-y-0.5 hover:border-[#01ACAD]/40 transition ${
                      item.customClass || ''
                    }`}
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      {item.dayNum}
                    </span>
                    <div className="text-sm sm:text-base font-black text-[#002559]">
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personaje Cóndor 5 Soles ocupando ~50% de la tarjeta a la DERECHA */}
          <div className="flex items-center justify-center w-full h-48 sm:h-56 md:h-64 lg:h-72">
            <img
              src="./Img/5soles.png"
              alt="Cóndor 5 Soles"
              className="h-full w-auto max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Fila 2: Regalo Principal (S/ 50) - Cóndor GRANDE a la IZQUIERDA (50%), Data a la DERECHA (50%) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-10 relative overflow-hidden">
          {/* Personaje Cóndor 50 Soles ocupando ~50% de la tarjeta a la IZQUIERDA */}
          <div className="flex items-center justify-center w-full h-48 sm:h-56 md:h-64 lg:h-72 order-2 md:order-1">
            <img
              src="./Img/50soles.png"
              alt="Cóndor 50 Soles"
              className="h-full w-auto max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Data a la derecha: directamente sobre la tarjeta */}
          <div className="w-full order-1 md:order-2 flex items-center justify-center md:justify-start gap-4 sm:gap-8">
            {/* Bloque Fecha en grande */}
            <div className="shrink-0 flex flex-col items-center justify-center text-center border-r border-slate-200 pr-4 sm:pr-8 select-none">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD]">
                Diciembre
              </span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#002559] leading-none tracking-tight mt-1">
                24
              </span>
            </div>

            {/* Datos del evento */}
            <div className="space-y-2 text-left min-w-0">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-600 block">
                Gran Intercambio
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002559] leading-tight">
                Regalo Principal
              </h3>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full">
                <span>Valor:</span>
                <span className="text-emerald-700 text-base sm:text-lg">S/ 50.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tarjeta de Inscripción (Funcionalidad Central) */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-10 relative overflow-hidden">
        {/* Contenido centrado en su propio lado izquierdo */}
        <div className="w-full flex flex-col items-center justify-center text-center space-y-4">
          {!hasVoted ? (
            /* Estado A: Aún no se ha inscrito */
            <div className="space-y-4 flex flex-col items-center text-center">
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#01ACAD]">
                  Participación Oficial
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#002559]">
                  ¿Te unes al Juego del Ángel?
                </h3>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => onOpenVoteModal('yes')}
                  className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-7 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm transition-all duration-200 shadow-sm inline-flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Quiero participar!</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenVoteModal('no')}
                  className="w-full sm:w-auto py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm transition-all duration-200 inline-flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                  <span>No voy a participar</span>
                </button>
              </div>
            </div>
          ) : isNotParticipating ? (
            /* Estado B1: Registró que NO participa */
            <div className="space-y-4 w-full flex flex-col items-center text-center">
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">
                  Respuesta Registrada
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800">
                  No participarás en el Ángel
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                  Registraste que no formarás parte del intercambio este año.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onChangeVote('yes')}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>¿Cambiaste de opinión? Haz clic aquí para unirte</span>
                </button>
              </div>
            </div>
          ) : (
            /* Estado B2: Ya se inscribió con éxito (SÍ participa) */
            <div className="space-y-4 w-full flex flex-col items-center text-center">
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-600">
                  Inscripción Confirmada
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#002559]">
                  ¡Ya estás participando!
                </h3>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onChangeVote()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#002559] transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>¿Deseas editar tu sugerencia de regalo o respuesta?</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Personaje Cóndor Pregunta centrado en su propio lado derecho */}
        <div className="flex items-center justify-center w-full h-48 sm:h-56 md:h-64 lg:h-72">
          <img
            src="./Img/CondorPregunta.png"
            alt="Cóndor Pregunta"
            className="h-full w-auto max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* 4. Normas de Convivencia y Buen Compartir */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-[#01ACAD]" />
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#002559]">
              Normas de Convivencia y Buen Compartir
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-xs">
          {/* Norma 1: La Cajita Navideña */}
          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-amber-800" />
              </span>
              <span className="font-black text-slate-800">La Cajita Navideña Común</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Se habilitará una cajita común en la oficina donde todos depositarán los regalos de su <strong>amigo secreto</strong> con su <strong>nombre bien visible</strong>. Así aseguramos una entrega ordenada y protegemos el anonimato.
            </p>
          </div>

          {/* Norma 2: No Perecibles */}
          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="font-black text-slate-800">Solo Cosas No Perecibles</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Para los regalos diarios, elegir <strong>artículos no perecibles</strong> (galletas, chocolates, café, tés, dulces sellados o detalles útiles). Evitar productos que se descompongan con el calor o requieran refrigeración.
            </p>
          </div>

          {/* Norma 3: Respeto a los Montos */}
          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                <Scale className="w-3.5 h-3.5 text-emerald-800" />
              </span>
              <span className="font-black text-slate-800">Respeto a los Montos (S/ 5 a S/ 50)</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              El rango oficial es de <strong>mínimo S/ 5 para diarios y S/ 50 para el principal</strong>. <strong>No exigir más ni menos de eso</strong>; todo detalle que cumpla con el monto pactado es plenamente respetado y valioso.
            </p>
          </div>

          {/* Norma 4: Consideración y Empatía */}
          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#002559] font-black text-xs flex items-center justify-center">
                4
              </span>
              <span className="font-black text-slate-800">Consideración Mutua y Gratitud</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Tener consideración entre todos. Dar con cariño e ilusión, y <strong>recibir con gratitud sincera</strong>. El juego es un espacio de unión y compañerismo, sin juzgar gustos ni hacer comparaciones.
            </p>
          </div>

          {/* Norma 5: Puntualidad en las 5 Fechas */}
          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-100 text-[#01ACAD] font-black text-xs flex items-center justify-center">
                5
              </span>
              <span className="font-black text-slate-800">Puntualidad en las 5 Fechas</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Cumplir puntualmente en los días <strong>01, 03, 10, 15 y 17 de diciembre</strong>. La responsabilidad y puntualidad garantizan que ningún compañero se quede esperando con desilusión mientras otros reciben su detalle.
            </p>
          </div>

          {/* Norma 6: Magia y Secreto */}
          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center">
                6
              </span>
              <span className="font-black text-slate-800">Secreto Total y Buena Vibra</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Cero pistas directas que revelen tu identidad antes del <strong>24 de diciembre</strong>. Acompaña cada entrega con notas alegres, dedicatorias cariñosas y mantén viva la magia navideña.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
