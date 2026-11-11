import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2 } from 'lucide-react';

import { INITIAL_VENUES } from './data/venues';
import { getLiveVoteCounts, insertVote, checkEmployeeHasVoted } from './lib/supabase';
import Header from './components/Header';
import VenueCard from './components/VenueCard';
import VenueModal from './components/VenueModal';
import VoteConfirmationModal from './components/VoteConfirmationModal';
import VotingStats from './components/VotingStats';
import ComparatorModal from './components/ComparatorModal';
import SnowEffect from './components/SnowEffect';
import ChristmasPlaylistAndComments from './components/ChristmasPlaylistAndComments';
import ChristmasAudioIntro from './components/ChristmasAudioIntro';
import DuplicateVoteModal from './components/DuplicateVoteModal';

export default function App() {
  const [duplicateVoteData, setDuplicateVoteData] = useState(null);
  const [venues, setVenues] = useState(() => {
    const saved = localStorage.getItem('caja_navidad_venues');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with INITIAL_VENUES so new photos and proposals update automatically while keeping user votes
        return INITIAL_VENUES.map((v) => {
          const found = parsed.find((p) => p.id === v.id);
          return {
            ...v,
            votes: typeof found?.votes === 'number' ? found.votes : v.initialVotes
          };
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VENUES.map((v) => ({ ...v, votes: v.initialVotes }));
  });

  const [userVote, setUserVote] = useState(() => {
    const saved = localStorage.getItem('caja_navidad_user_vote');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [viewingVenue, setViewingVenue] = useState(null);
  const [votingForVenue, setVotingForVenue] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparedVenueIds, setComparedVenueIds] = useState(['cerro-juli', 'costa-del-sol']);
  const [voteToast, setVoteToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('caja_navidad_venues', JSON.stringify(venues));
  }, [venues]);

  // Sincronización en tiempo real de los votos acumulados desde Supabase
  useEffect(() => {
    let isMounted = true;

    const syncVotes = async () => {
      const liveCounts = await getLiveVoteCounts();
      if (!isMounted || !liveCounts) return;

      setVenues((prev) =>
        prev.map((v) => {
          const match = liveCounts.find((c) => c.venue_id === v.id);
          const additional = match ? Number(match.count) : 0;
          return {
            ...v,
            votes: v.initialVotes + additional
          };
        })
      );
    };

    syncVotes();
    const interval = setInterval(syncVotes, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Precarga inteligente en segundo plano de todas las fotos de las sedes
  useEffect(() => {
    if (!venues || venues.length === 0) return;
    const allImages = venues.flatMap((v) => v.gallery || [v.image]);
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [venues]);

  useEffect(() => {
    if (userVote) {
      localStorage.setItem('caja_navidad_user_vote', JSON.stringify(userVote));
    } else {
      localStorage.removeItem('caja_navidad_user_vote');
    }
  }, [userVote]);

  // Si se eliminó el voto en Supabase desde la base de datos, desvincularlo localmente
  useEffect(() => {
    let isMounted = true;
    if (!userVote?.employeeCode) return;

    checkEmployeeHasVoted(userVote.employeeCode).then((dbVote) => {
      if (!isMounted) return;
      if (!dbVote) {
        // El voto ya no existe en la base de datos
        console.log('El voto fue eliminado de Supabase. Limpiando estado local.');
        localStorage.removeItem('caja_navidad_user_vote');
        setUserVote(null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userVote?.employeeCode]);

  const totalVotes = useMemo(() => {
    return venues.reduce((acc, curr) => acc + (curr.votes || 0), 0);
  }, [venues]);

  const leaderId = useMemo(() => {
    if (!venues.length) return null;
    const sorted = [...venues].sort((a, b) => b.votes - a.votes);
    return sorted[0].id;
  }, [venues]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#002559', '#01ACAD', '#FFB800', '#E30613', '#ffffff']
      });
    } catch (e) {
      console.log('Confetti effect');
    }
  };

  const handleVoteSubmit = async (voteData) => {
    if (userVote) {
      setVotingForVenue(null);
      setDuplicateVoteData({
        employeeCode: userVote.employeeCode,
        email: userVote.email
      });
      return;
    }

    // 1. Guardar en Supabase
    const res = await insertVote({
      employeeCode: voteData.employeeCode,
      email: voteData.email,
      preferredDate: voteData.preferredDate,
      venueId: voteData.venueId,
      venueName: voteData.venueName
    });

    if (res && !res.success && res.duplicate) {
      setVotingForVenue(null);
      setDuplicateVoteData({
        employeeCode: voteData.employeeCode,
        email: voteData.email
      });
      return;
    }

    // 2. Actualización optimista de UI
    setVenues((prev) =>
      prev.map((v) => {
        if (userVote && userVote.venueId === v.id && v.id !== voteData.venueId) {
          return { ...v, votes: Math.max(0, v.votes - 1) };
        }
        if (v.id === voteData.venueId) {
          if (userVote?.venueId === v.id) return v;
          return { ...v, votes: v.votes + 1 };
        }
        return v;
      })
    );

    setUserVote(voteData);
    setVotingForVenue(null);
    triggerConfetti();

    setVoteToast('¡Voto registrado!');
    setTimeout(() => setVoteToast(null), 3500);
  };

  const handleToggleCompare = (venueId) => {
    setComparedVenueIds((prev) => {
      if (prev.includes(venueId)) {
        return prev.filter((id) => id !== venueId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), venueId];
      }
      return [...prev, venueId];
    });
  };

  const handleResetDemoVotes = () => {
    if (window.confirm('¿Deseas reiniciar la simulación de votos a los valores iniciales?')) {
      const reset = INITIAL_VENUES.map((v) => ({ ...v, votes: v.initialVotes }));
      setVenues(reset);
      setUserVote(null);
      localStorage.removeItem('caja_navidad_user_vote');
      localStorage.removeItem('caja_navidad_venues');
      setVoteToast('Se han restablecido los votos para una nueva prueba.');
      setTimeout(() => setVoteToast(null), 4000);
    }
  };

  const selectedForCompare = useMemo(() => {
    return venues.filter((v) => comparedVenueIds.includes(v.id));
  }, [venues, comparedVenueIds]);

  return (
    <div
      className="min-h-screen text-slate-800 flex flex-col relative selection:bg-[#01ACAD] selection:text-[#002559]"
      style={{
        backgroundColor: '#F4F7FB',
        backgroundImage: "url('./Img/fondo.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Falling snow animation (always active) */}
      <SnowEffect />

      {/* Christmas Background Audio */}
      <ChristmasAudioIntro />

      {/* Floating Notification Toast */}
      {voteToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002559] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#01ACAD] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="text-[#01ACAD]">✓</span>
          <span>{voteToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <Header
        totalVotes={totalVotes}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Venues Grid */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-3">
            <h2 className="text-lg sm:text-2xl font-black text-[#002559] flex items-center gap-2">
              <span>Sedes Candidatas</span>
              <span className="text-[11px] sm:text-xs font-black bg-[#01ACAD]/20 text-[#002559] px-2.5 py-0.5 rounded-full">
                {venues.length} opciones
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  totalVotes={totalVotes}
                  userVote={userVote}
                  onVoteClick={() => {
                    // Votación cerrada: no permite abrir modal de confirmación
                  }}
                  onDetailsClick={(v) => setViewingVenue(v)}
                  isLeader={venue.id === leaderId}
                  isCompared={comparedVenueIds.includes(venue.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
        </section>

        {/* Interactive DJ Song Requests & Messages Wall */}
        <ChristmasPlaylistAndComments />

      </main>

      {/* Footer styled with white background and logo_CJ_blanco.png */}
      <footer className="mt-12 text-xs border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center gap-3 text-center">
          <img
            src="./Img/logo_CJ_blanco.png"
            alt="Caja Arequipa"
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <p className="text-[11px] font-black tracking-widest text-[#002559] uppercase">
            POWERED BY ATIN
          </p>
        </div>
      </footer>

      {/* Modals */}
      {viewingVenue && (
        <VenueModal
          venue={viewingVenue}
          onClose={() => setViewingVenue(null)}
          onVote={(v) => setVotingForVenue(v)}
          isVotedByMe={userVote?.venueId === viewingVenue.id}
        />
      )}

      {votingForVenue && (
        <VoteConfirmationModal
          venue={votingForVenue}
          onClose={() => setVotingForVenue(null)}
          onSubmitVote={handleVoteSubmit}
          existingVote={userVote?.venueId === votingForVenue.id ? userVote : null}
        />
      )}

      {showResultsModal && (
        <VotingStats
          venues={venues}
          totalVotes={totalVotes}
          onClose={() => setShowResultsModal(false)}
        />
      )}

      {showCompareModal && (
        <ComparatorModal
          selectedVenues={selectedForCompare}
          allVenues={venues}
          onClose={() => setShowCompareModal(false)}
          onVote={(v) => setVotingForVenue(v)}
          onToggleCompare={handleToggleCompare}
          userVote={userVote}
        />
      )}

      {/* Modal elegante para voto duplicado / ya emitido */}
      <DuplicateVoteModal
        isOpen={Boolean(duplicateVoteData)}
        onClose={() => setDuplicateVoteData(null)}
        data={duplicateVoteData}
      />
    </div>
  );
}
