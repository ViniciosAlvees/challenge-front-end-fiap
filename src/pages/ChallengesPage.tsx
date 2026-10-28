import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { ApiError, getCurrentAccount } from "../services/api";
import type { AccountUser } from "../services/api";
import {
  completeChallenge,
  getCompletedChallengeIds,
  getChallengePoints,
  sustainableChallenges,
} from "../services/challenges";

export default function ChallengesPage() {
  const location = useLocation();
  const initialChallengeId =
    typeof location.state === "object" &&
    location.state !== null &&
    "challengeId" in location.state &&
    typeof location.state.challengeId === "number" &&
    sustainableChallenges.some(
      (challenge) => challenge.id === location.state.challengeId,
    )
      ? location.state.challengeId
      : null;
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialChallengeId,
  );
  const [startedChallengeId, setStartedChallengeId] = useState<number | null>(
    null,
  );
  const [evidence, setEvidence] = useState<File | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [accountNotice, setAccountNotice] = useState("");

  useEffect(() => {
    let active = true;

    getCurrentAccount()
      .then((currentAccount) => {
        if (active) setAccount(currentAccount);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          setAccount(null);
        } else {
          setAccountNotice(
            error instanceof Error
              ? `Não foi possível verificar a sessão: ${error.message}`
              : "Não foi possível verificar a sessão.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      setCompletedIds(getCompletedChallengeIds(account?.id ?? null));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível ler seu progresso.",
      );
    }
  }, [account]);

  const selectedChallenge = sustainableChallenges.find(
    (challenge) => challenge.id === selectedId,
  );

  const selectEvidence = (event: ChangeEvent<HTMLInputElement>) => {
    setEvidence(event.target.files?.[0] ?? null);
    setErrorMessage("");
    setSavedMessage("");
  };

  const submitChallenge = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedChallenge) return;
    if (!evidence) {
      setErrorMessage("Selecione uma foto como evidência antes de concluir.");
      return;
    }
    if (!evidence.type.startsWith("image/")) {
      setErrorMessage("O arquivo selecionado precisa ser uma imagem.");
      return;
    }

    try {
      completeChallenge(account?.id ?? null, selectedChallenge.id);
      setCompletedIds(getCompletedChallengeIds(account?.id ?? null));
      setSavedMessage("Desafio concluído! Seus pontos foram atualizados no perfil.");
      setEvidence(null);
      setErrorMessage("");
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a conclusão do desafio.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
      <SectionTitle
        eyebrow="Ação sustentável"
        title="Desafios sustentáveis"
        description="Escolha uma atividade, envie uma foto como evidência e marque o desafio como concluído para acumular pontos."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sustainableChallenges.map((challenge) => {
          const isSelected = selectedId === challenge.id;
          const isComplete = completedIds.includes(challenge.id);
          return (
            <button
              key={challenge.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedId(challenge.id);
                setStartedChallengeId(null);
                setEvidence(null);
                setErrorMessage("");
                setSavedMessage("");
              }}
              className={`rounded-2xl border p-5 text-left transition focus:outline-2 focus:outline-offset-2 focus:outline-leaf ${
                isSelected
                  ? "border-leaf bg-leaf/10"
                  : "border-white/10 bg-forest-soft hover:border-leaf/40"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                ID: {challenge.id} | {isComplete ? "Concluído" : "Ativo"}
              </span>
              <span className="mt-2 block text-lg font-bold text-white">
                {challenge.category}
              </span>
              <span className="mt-1 block text-sm leading-6 text-mint">
                {challenge.description}
              </span>
              <span className="mt-4 block font-semibold text-leaf">
                {challenge.points} pontos
              </span>
            </button>
          );
        })}
      </div>
      {accountNotice && (
        <p role="status" className="mt-5 text-sm text-muted">
          {accountNotice} O progresso será salvo como visitante neste navegador.
        </p>
      )}

      {selectedChallenge && (
        <section
          className="mt-8 rounded-3xl border border-leaf/25 bg-forest-soft p-6 sm:p-8"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-leaf">
                Desafio selecionado · ID {selectedChallenge.id}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {selectedChallenge.category}
              </h2>
              <p className="mt-2 text-mint">{selectedChallenge.description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-leaf/10 px-4 py-2 text-sm font-bold text-leaf">
              {selectedChallenge.points} pontos
            </span>
          </div>

          {completedIds.includes(selectedChallenge.id) ? (
            <p className="mt-7 rounded-xl border border-leaf/20 bg-leaf/5 p-4 font-semibold text-leaf">
              Desafio concluído. Os pontos já estão contabilizados no seu perfil.
            </p>
          ) : startedChallengeId !== selectedChallenge.id ? (
            <button
              type="button"
              onClick={() => {
                setStartedChallengeId(selectedChallenge.id);
                setErrorMessage("");
                setSavedMessage("");
              }}
              className="mt-6 rounded-full bg-leaf px-6 py-3 font-bold text-forest transition hover:bg-leaf-bright"
            >
              Iniciar desafio
            </button>
          ) : null}
        </section>
      )}

      {selectedChallenge &&
        startedChallengeId === selectedChallenge.id &&
        !completedIds.includes(selectedChallenge.id) && (
          <section className="mt-5 rounded-3xl border border-white/10 bg-forest-soft/70 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-leaf">
              Etapa de conclusão · ID {selectedChallenge.id}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Envie a evidência
            </h2>
            <p className="mt-2 text-mint">
              Quando concluir “{selectedChallenge.description}”, envie uma foto
              e confirme a conclusão.
            </p>
            <form className="mt-7 space-y-5" onSubmit={submitChallenge}>
              <div>
                <label
                  className="block text-sm font-semibold text-white"
                  htmlFor="challenge-evidence"
                >
                  Envie uma foto como evidência
                </label>
                <input
                  id="challenge-evidence"
                  type="file"
                  accept="image/*"
                  required
                  onChange={selectEvidence}
                  className="mt-3 block w-full text-sm text-mint file:mr-4 file:rounded-full file:border-0 file:bg-leaf/10 file:px-4 file:py-2 file:font-semibold file:text-leaf hover:file:bg-leaf/20"
                />
                {evidence && (
                  <p className="mt-2 text-sm text-muted">
                    Foto selecionada: {evidence.name}
                  </p>
                )}
              </div>
              <p className="text-sm leading-6 text-muted">
                A foto é usada nesta demonstração local e não é enviada para um
                servidor. A conclusão e os pontos ficam salvos neste navegador.
              </p>
              {errorMessage && (
                <p role="alert" className="text-sm text-red-200">
                  {errorMessage}
                </p>
              )}
              {savedMessage && (
                <p role="status" className="text-sm text-leaf">
                  {savedMessage}
                </p>
              )}
              <button
                type="submit"
                className="rounded-full bg-leaf px-6 py-3 font-bold text-forest transition hover:bg-leaf-bright"
              >
                Enviar foto e concluir
              </button>
            </form>
          </section>
        )}

      <p className="mt-8 text-sm text-muted">
        Pontos acumulados:{" "}
        <strong className="text-leaf">
          {getChallengePoints(completedIds)}
        </strong>
        {" · "}
        <Link className="font-semibold text-leaf hover:underline" to="/perfil">
          Ver meu perfil
        </Link>
      </p>
    </div>
  );
}
