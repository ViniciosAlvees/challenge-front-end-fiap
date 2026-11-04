import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listUsers,
  listGroups,
  listChallenges,
  deleteUser,
  deleteGroup,
} from "../services/api";
import type { ApiUser, ApiGroup, ApiChallenge } from "../services/api";
import SectionTitle from "../components/SectionTitle";
import RequestFeedback from "../components/RequestFeedback";

export default function AdminManagementPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [challenges, setChallenges] = useState<ApiChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setErrors([]);
    Promise.allSettled([listUsers(), listGroups(), listChallenges()])
      .then(([userResult, groupResult, challengeResult]) => {
        if (!active) return;
        setUsers(userResult.status === "fulfilled" ? userResult.value : []);
        setGroups(groupResult.status === "fulfilled" ? groupResult.value : []);
        setChallenges(
          challengeResult.status === "fulfilled" ? challengeResult.value : [],
        );
        setErrors(
          [userResult, groupResult, challengeResult].flatMap((result, index) =>
            result.status === "rejected"
              ? [
                  `${["Usuários", "Grupos", "Desafios"][index]}: ${result.reason instanceof Error ? result.reason.message : "Não foi possível carregar."}`,
                ]
              : [],
          ),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  async function remove(kind: "user" | "group", id: number) {
    if (
      !window.confirm(
        "Deseja excluir este cadastro da API? Esta operação não pode ser desfeita.",
      )
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      await (kind === "user" ? deleteUser(id) : deleteGroup(id));
      const records = await (kind === "user" ? listUsers() : listGroups());
      if (records.some((record) => record.id === id))
        throw new Error(
          "A API respondeu à solicitação, mas o registro continua cadastrado. Confira o servidor antes de repetir.",
        );
      setMessage("Exclusão confirmada pela API.");
      setAttempt((value) => value + 1);
    } catch (cause) {
      setErrors([
        cause instanceof Error
          ? cause.message
          : "Não foi possível confirmar a exclusão.",
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <SectionTitle
        eyebrow="Gestão"
        title="Cadastros da API"
        description="Consulte os registros atuais e acompanhe as respostas do servidor."
      />
      <div className="mb-6 flex flex-wrap gap-4">
        <Link
          to="/acesso-funcionario"
          className="text-sm font-semibold text-leaf hover:underline"
        >
          Ferramentas de funcionários
        </Link>
        <button
          type="button"
          disabled={loading || busy}
          onClick={() => setAttempt((value) => value + 1)}
          className="text-sm font-semibold text-leaf hover:underline disabled:opacity-50"
        >
          Atualizar cadastros
        </button>
      </div>
      <RequestFeedback
        loading={loading}
        error={errors.join(" ")}
        onRetry={() => setAttempt((value) => value + 1)}
      />
      {message && (
        <p role="status" className="my-5 text-leaf">
          {message}
        </p>
      )}
      {!loading && (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-white">Usuários</h2>
            {!users.length &&
              !errors.some((error) => error.startsWith("Usuários:")) && (
                <p className="text-muted">Nenhum usuário cadastrado.</p>
              )}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="min-w-0 rounded-2xl border border-white/10 bg-forest-soft p-5"
                >
                  <p className="break-words font-bold text-white">
                    {user.nome}
                  </p>
                  <p className="mt-2 break-all text-sm text-mint">
                    {user.email}
                  </p>
                  <Link
                    to={`/funcionarios/usuarios/${user.id}`}
                    className="mt-4 block text-sm font-semibold text-leaf hover:underline"
                  >
                    Ver detalhes
                  </Link>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void remove("user", user.id)}
                    className="mt-4 rounded-full border border-red-300/30 px-4 py-2 text-sm text-red-200 disabled:opacity-50"
                  >
                    Excluir usuário
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold text-white">Grupos</h2>
            {!groups.length &&
              !errors.some((error) => error.startsWith("Grupos:")) && (
                <p className="text-muted">Nenhum grupo cadastrado.</p>
              )}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <li
                  key={group.id}
                  className="min-w-0 rounded-2xl border border-white/10 bg-forest-soft p-5"
                >
                  <p className="break-words font-bold text-white">
                    {group.nome}
                  </p>
                  <Link
                    to={`/grupos/${group.id}`}
                    className="mt-4 block text-sm font-semibold text-leaf hover:underline"
                  >
                    Ver detalhes
                  </Link>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void remove("group", group.id)}
                    className="mt-4 rounded-full border border-red-300/30 px-4 py-2 text-sm text-red-200 disabled:opacity-50"
                  >
                    Excluir grupo
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold text-white">Desafios</h2>
            {!challenges.length &&
              !errors.some((error) => error.startsWith("Desafios:")) && (
                <p className="text-muted">Nenhum desafio cadastrado.</p>
              )}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => (
                <li
                  key={challenge.id}
                  className="min-w-0 rounded-2xl border border-white/10 bg-forest-soft p-5"
                >
                  <p className="text-xs font-semibold text-leaf">
                    {challenge.categoria}
                  </p>
                  <h3 className="mt-2 break-words font-bold text-white">
                    {challenge.titulo}
                  </h3>
                  <p className="mt-2 break-words text-sm text-mint">
                    {challenge.descricao}
                  </p>
                  <p className="mt-3 font-semibold text-leaf">
                    {challenge.pontos} pontos
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
