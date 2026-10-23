import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import SectionTitle from "../components/SectionTitle";

type SimulationPhase = "ready" | "evidence" | "validating" | "complete";

export default function AvatarPage() {
  const [phase, setPhase] = useState<SimulationPhase>("ready");
  const [points, setPoints] = useState(0);
  const [evidence, setEvidence] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (phase !== "validating") return;

    const timeoutId = window.setTimeout(() => {
      setPoints(135);
      setPhase("complete");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [phase]);

  const selectEvidence = (event: ChangeEvent<HTMLInputElement>) => {
    setEvidence(event.target.files?.[0] ?? null);
    setError("");
  };

  const submitEvidence = () => {
    if (!evidence) {
      setError("Selecione uma imagem antes de enviar.");
      return;
    }

    setPoints(120);
    setPhase("validating");
  };

  const restart = () => {
    setPhase("ready");
    setPoints(0);
    setEvidence(null);
    setError("");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
      <SectionTitle
        eyebrow="Mentor digital"
        title="Conheça o papel do Avatar"
        description="O avatar atua como mestre do jogo e mentor do sistema: entende as preferências do grupo e recomenda desafios adequados."
      />

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-forest-soft p-6">
            <h2 className="text-xl font-bold text-white">O que torna o modelo diferente?</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-mint">
              <li><strong className="text-leaf">Foco coletivo:</strong> quando o grupo avança, seus membros acumulam pontos juntos.</li>
              <li><strong className="text-leaf">Validação por proximidade:</strong> outras pessoas podem confirmar a realização da ação.</li>
              <li><strong className="text-leaf">Gamificação real:</strong> rankings e desafios ajudam a manter o engajamento.</li>
            </ul>
          </div>
          <p className="rounded-2xl border border-leaf/15 bg-leaf/5 p-5 text-sm leading-6 text-muted">
            Simulação local para demonstração. A evidência selecionada não é enviada nem armazenada.
          </p>
        </section>

        <section className="rounded-3xl border border-leaf/25 bg-forest-soft p-6 sm:p-8" aria-live="polite">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf/10 text-3xl">🤖</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-leaf">Simulador interativo</p>
              <h2 className="mt-1 text-xl font-bold text-white">Jornada do desafio</h2>
            </div>
          </div>

          <div className="mt-8 min-h-48 space-y-5">
            {phase === "ready" && (
              <div>
                <p className="text-mint">Etapa 1 · O grupo concluiu o desafio sustentável?</p>
                <button
                  type="button"
                  onClick={() => {
                    setPoints(100);
                    setPhase("evidence");
                  }}
                  className="mt-5 rounded-full bg-leaf px-5 py-3 font-bold text-forest transition hover:bg-leaf-bright"
                >
                  Confirmar conclusão
                </button>
              </div>
            )}

            {phase === "evidence" && (
              <div>
                <label htmlFor="evidence" className="font-semibold text-white">
                  Etapa 2 · Envie uma imagem como evidência
                </label>
                <input
                  id="evidence"
                  type="file"
                  accept="image/*"
                  onChange={selectEvidence}
                  className="mt-4 block w-full text-sm text-mint file:mr-4 file:rounded-full file:border-0 file:bg-leaf/10 file:px-4 file:py-2 file:font-semibold file:text-leaf hover:file:bg-leaf/20"
                />
                {evidence && <p className="mt-2 text-sm text-muted">{evidence.name}</p>}
                {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
                <button
                  type="button"
                  onClick={submitEvidence}
                  className="mt-5 rounded-full bg-leaf px-5 py-3 font-bold text-forest transition hover:bg-leaf-bright"
                >
                  Enviar para validação
                </button>
              </div>
            )}

            {phase === "validating" && (
              <div className="flex items-center gap-3 text-mint">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-leaf" />
                Etapa 3 · A comunidade está validando a evidência...
              </div>
            )}

            {phase === "complete" && (
              <div>
                <p className="font-semibold text-leaf">Validação concluída ✔</p>
                <p className="mt-2 text-mint">Desafio aprovado. Pontuação total: {points} pontos.</p>
                <button
                  type="button"
                  onClick={restart}
                  className="mt-5 rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:border-leaf/50 hover:text-leaf"
                >
                  Simular novamente
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-white/10 pt-5 text-sm text-muted">
            Pontos acumulados nesta simulação: <strong className="text-leaf">{points}</strong>
          </div>
        </section>
      </div>
    </div>
  );
}
