import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import SectionTitle from "../components/SectionTitle";
import { ApiError } from "../services/api";
import type { ApiUser } from "../services/api";
import { checkEmployeeAccess, listEmployeeUsers } from "../services/employee";
import { createLocalChallenge, decideLocalAction, getLocalActions, getLocalChallenges, getLocalRanking, toggleLocalChallenge } from "../services/challenges";
import type { LocalAction, SustainableChallenge } from "../services/challenges";

const options = ["Consultar usuários da API", "Criar desafio", "Ativar/desativar desafio", "Consultar ações", "Aprovar/rejeitar ação", "Ranking local"];
const inputClass = "mt-2 w-full rounded-xl border border-white/20 bg-forest px-4 py-3 text-white outline-none focus:border-leaf";
const buttonClass = "rounded-full bg-leaf px-5 py-3 text-sm font-bold text-forest hover:bg-leaf-bright disabled:opacity-50";

export default function EmployeeAccessPage() {
  const [selected, setSelected] = useState(0);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [challenges, setChallenges] = useState<SustainableChallenge[]>([]);
  const [actions, setActions] = useState<LocalAction[]>([]);
  const [ranking, setRanking] = useState<ReturnType<typeof getLocalRanking>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState(100);
  const [opinions, setOpinions] = useState<Record<number, string>>({});

  function refreshLocal() {
    setChallenges(getLocalChallenges());
    setActions(getLocalActions());
    setRanking(getLocalRanking());
  }

  async function load() {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!await checkEmployeeAccess()) throw new Error("Sua sessão expirou. Saia desta área e informe a senha novamente.");
      if (selected === 0) setUsers(await listEmployeeUsers());
      refreshLocal();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar os dados.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [selected]);

  async function change(operation: () => void, message: string) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!await checkEmployeeAccess()) throw new ApiError("Sua sessão expirou. Saia desta área e informe a senha novamente.", 401);
      operation();
      refreshLocal();
      setSuccess(message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar a alteração.");
    } finally { setLoading(false); }
  }

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void change(() => {
      createLocalChallenge(description, category, points);
      setDescription(""); setCategory(""); setPoints(100);
    }, "Desafio criado e disponível na página Desafios.");
  }

  const visibleActions = selected === 4 ? actions.filter((action) => action.status === "pendente") : actions;

  return <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
    <SectionTitle eyebrow="Gestão Soul Up" title="Acesso Funcionário" description="Gerencie desafios e acompanhe as ações sustentáveis da comunidade." />
    <div className="grid items-start gap-7 lg:grid-cols-[280px_1fr]">
      <nav aria-label="Ferramentas de funcionários" className="grid gap-2 rounded-3xl border border-white/10 bg-forest-soft p-3 sm:grid-cols-2 lg:grid-cols-1">
        {options.map((label, index) => <button key={label} type="button" aria-current={selected === index ? "page" : undefined} onClick={() => { setSelected(index); setError(""); setSuccess(""); }} className={`flex items-start gap-3 rounded-2xl px-4 py-4 text-left text-sm font-semibold transition ${selected === index ? "bg-leaf/10 text-leaf" : "text-mint hover:bg-white/5"}`}><span className="font-black">{index + 1}</span>{label}</button>)}
      </nav>
      <section aria-labelledby="employee-section-title" className="min-w-0 rounded-3xl border border-white/10 bg-forest-soft p-5 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="employee-section-title" className="text-2xl font-bold text-white">{options[selected]}</h2>
          <button type="button" onClick={() => void load()} disabled={loading} className="rounded-full border border-white/20 px-4 py-2 text-sm text-mint hover:border-leaf disabled:opacity-50">Atualizar</button>
        </div>
        {loading && <p role="status" className="mb-5 text-mint">Carregando...</p>}
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-300/20 p-4 text-sm text-red-200">{error}</p>}
        {success && <p role="status" className="mb-5 rounded-xl border border-leaf/20 p-4 text-sm text-leaf">{success}</p>}

        {selected === 0 && !loading && !error && (users.length ? <ul className="space-y-3">{users.map((user) => <li key={user.id} className="rounded-2xl border border-white/10 p-4"><p className="font-bold text-white">{user.nome} <span className="text-sm font-normal text-muted">· ID {user.id}</span></p><p className="mt-1 break-all text-sm text-mint">{user.email}</p></li>)}</ul> : <p className="text-muted">Nenhum usuário retornado pela API.</p>)}

        {selected === 1 && <form onSubmit={create} className="space-y-5">
          <label className="block text-sm font-semibold text-mint" htmlFor="new-challenge-description">Descrição<textarea id="new-challenge-description" required minLength={5} value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={inputClass} /></label>
          <label className="block text-sm font-semibold text-mint" htmlFor="new-challenge-category">Categoria<input id="new-challenge-category" required minLength={3} value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-semibold text-mint" htmlFor="new-challenge-points">Pontos<input id="new-challenge-points" type="number" required min={1} max={10000} step={1} value={points} onChange={(event) => setPoints(Number(event.target.value))} className={inputClass} /></label>
          <button type="submit" disabled={loading} className={buttonClass}>Criar desafio</button>
        </form>}

        {selected === 2 && <ul className="space-y-3">{challenges.map((challenge) => <li key={challenge.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 p-4"><div className="min-w-0 flex-1"><p className="font-semibold text-white">{challenge.description}</p><p className="mt-1 text-sm text-muted">ID {challenge.id} · {challenge.category} · {challenge.points} pontos · {challenge.active ? "Ativo" : "Inativo"}</p></div><button type="button" disabled={loading} onClick={() => void change(() => toggleLocalChallenge(challenge.id), "Status atualizado. O histórico foi preservado.")} className="rounded-full border border-leaf/30 px-4 py-2 text-sm font-semibold text-leaf disabled:opacity-50">{challenge.active ? "Desativar" : "Ativar"}<span className="sr-only"> desafio {challenge.id}</span></button></li>)}</ul>}

        {(selected === 3 || selected === 4) && (visibleActions.length ? <ul className="space-y-4">{visibleActions.map((action) => <li key={action.id} className="rounded-2xl border border-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-leaf">Ação {action.id} · {action.status} · {action.points} pontos</p>
          <h3 className="mt-2 font-bold text-white">{action.description}</h3><p className="mt-1 text-sm text-muted">{action.userName} · {action.userEmail}</p>
          <p className="mt-4 whitespace-pre-wrap break-words text-sm text-mint">{action.evidence}</p>
          {action.evidenceImage && /^data:image\/(jpeg|png|webp|gif);base64,/.test(action.evidenceImage) && <img src={action.evidenceImage} alt={`Evidência da ação de ${action.userName}`} className="mt-4 max-h-72 max-w-full rounded-xl object-contain" />}
          {action.opinion && <p className="mt-3 text-sm text-muted">Parecer: {action.opinion}</p>}
          {selected === 4 && <form className="mt-5 space-y-3" onSubmit={(event) => { event.preventDefault(); const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; void change(() => decideLocalAction(action.id, submitter?.value === "aprovar", opinions[action.id] || ""), "Análise registrada. O ranking local foi atualizado."); }}>
            <label htmlFor={`opinion-${action.id}`} className="block text-sm font-semibold text-mint">Parecer da análise<textarea id={`opinion-${action.id}`} required minLength={5} rows={2} value={opinions[action.id] || ""} onChange={(event) => setOpinions((previous) => ({ ...previous, [action.id]: event.target.value }))} className={inputClass} /></label>
            <div className="flex flex-wrap gap-3"><button type="submit" value="aprovar" disabled={loading} className={buttonClass}>Aprovar ação</button><button type="submit" value="rejeitar" disabled={loading} className="rounded-full border border-red-300/40 px-5 py-3 text-sm font-bold text-red-200 disabled:opacity-50">Rejeitar ação</button></div>
          </form>}
        </li>)}</ul> : <p className="text-muted">{selected === 4 ? "Nenhuma ação pendente de análise." : "Nenhuma ação publicada neste navegador. As evidências enviadas em Desafios aparecerão aqui."}</p>)}

        {selected === 5 && <><p className="mb-5 text-sm leading-6 text-muted">Somente ações aprovadas somam pontos neste ranking. Esta pontuação local não altera os pontos da API Java.</p>{ranking.length ? <ol className="space-y-3">{ranking.map((entry, index) => <li key={entry.userId} className="flex items-center gap-4 rounded-2xl border border-white/10 p-4"><span className="text-xl font-black text-leaf">{index + 1}º</span><span className="min-w-0 flex-1 break-words font-semibold text-white">{entry.name}</span><span className="text-sm font-bold text-leaf">{entry.points} pontos</span></li>)}</ol> : <p className="text-muted">O ranking aparecerá quando os usuários publicarem ações.</p>}</>}
      </section>
    </div>
    <p className="mt-7 text-sm leading-6 text-muted">Desafios, ações e ranking são locais a este navegador. Os usuários são consultados na API Java.</p>
  </div>;
}
