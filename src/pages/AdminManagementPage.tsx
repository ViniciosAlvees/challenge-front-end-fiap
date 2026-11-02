import { useEffect, useState } from "react";
import {
  listUsers,
  listGroups,
  listChallenges,
  deleteUser,
  deleteGroup,
} from "../services/api";
import type { ApiUser, ApiGroup, ApiChallenge } from "../services/api";
import SectionTitle from "../components/SectionTitle";

export default function AdminManagementPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [challenges, setChallenges] = useState<ApiChallenge[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        
        const [usersData, groupsData, challengesData] = await Promise.all([
          listUsers().catch(() => []),
          listGroups().catch(() => []),
          listChallenges().catch(() => [])
        ]);

        setUsers(usersData);
        setGroups(groupsData);
        setChallenges(challengesData);
      } catch (error) {
        setErrorMessage("Erro ao carregar os dados do painel.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      alert("Erro ao excluir usuário.");
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este grupo?")) return;
    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      alert("Erro ao excluir grupo.");
    }
  };

  if (isLoading) {
    return <p role="status" className="py-20 text-center text-mint">Carregando painel de gestão...</p>;
  }

  if (errorMessage) {
    return <p role="alert" className="py-20 text-center text-red-400">{errorMessage}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionTitle eyebrow="Gestão" title="Painel Administrativo" />

      {/* SECCIÓN DE USUARIOS */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-white">Usuários Cadastrados</h2>
        {users.length === 0 ? (
          <p className="text-muted">Nenhum usuário encontrado.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <li key={user.id} className="rounded-xl border border-white/10 bg-forest-soft p-5">
                <p className="font-bold text-white">{user.nome}</p>
                <p className="text-sm text-mint">{user.email}</p>
                <p className="text-xs text-muted">ID: {user.id}</p>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="mt-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-800"
                >
                  Excluir Usuário
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* SECCIÓN DE GRUPOS */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-white">Grupos Cadastrados</h2>
        {groups.length === 0 ? (
          <p className="text-muted">Nenhum grupo encontrado.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <li key={group.id} className="rounded-xl border border-white/10 bg-forest-soft p-5">
                <p className="font-bold text-white">{group.nome}</p>
                <p className="text-xs text-muted">ID: {group.id}</p>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="mt-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-800"
                >
                  Excluir Grupo
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* SECCIÓN DE DESAFÍOS (SOLO LECTURA) */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Desafios no Banco de Dados</h2>
        {challenges.length === 0 ? (
          <p className="text-muted">Nenhum desafio retornado pela API.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <li key={challenge.id} className="rounded-xl border border-white/10 bg-forest-soft p-5">
                <span className="mb-2 inline-block rounded-full bg-leaf/10 px-2 py-1 text-xs font-bold text-leaf">
                  {challenge.categoria}
                </span>
                <p className="font-bold text-white">{challenge.titulo}</p>
                <p className="mt-1 text-sm text-mint">{challenge.descricao}</p>
                <p className="mt-2 text-sm font-bold text-leaf">+{challenge.pontos} pts</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}