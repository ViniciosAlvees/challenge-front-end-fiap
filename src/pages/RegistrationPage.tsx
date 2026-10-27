import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import SectionTitle from "../components/SectionTitle";
import {
  ApiError,
  createGroup,
  createUser,
  listGroups,
  listUsers,
} from "../services/api";
import type { ApiGroup, ApiUser } from "../services/api";

type UserForm = {
  nome: string;
  email: string;
};

type GroupForm = {
  nome: string;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-forest px-4 py-3 text-white outline-none transition placeholder:text-muted/70 focus:border-leaf";
const labelClass = "block text-sm font-semibold text-mint";
const buttonClass =
  "rounded-full bg-leaf px-6 py-3 font-bold text-forest transition hover:bg-leaf-bright focus:outline-2 focus:outline-offset-4 focus:outline-leaf disabled:cursor-not-allowed disabled:opacity-60";

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return `Erro HTTP ${error.status}: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocorreu um erro inesperado ao comunicar com a API.";
}

export default function RegistrationPage() {
  const [userForm, setUserForm] = useState<UserForm>({
    nome: "",
    email: "",
  });
  const [groupForm, setGroupForm] = useState<GroupForm>({ nome: "" });
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [userSubmitting, setUserSubmitting] = useState(false);
  const [groupSubmitting, setGroupSubmitting] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [groupsError, setGroupsError] = useState("");
  const [userFormError, setUserFormError] = useState("");
  const [groupFormError, setGroupFormError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const [groupSuccess, setGroupSuccess] = useState("");

  const refreshUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      setUsers(await listUsers());
    } catch (error) {
      setUsersError(errorMessage(error));
    } finally {
      setUsersLoading(false);
    }
  };

  const refreshGroups = async () => {
    setGroupsLoading(true);
    setGroupsError("");
    try {
      setGroups(await listGroups());
    } catch (error) {
      setGroupsError(errorMessage(error));
    } finally {
      setGroupsLoading(false);
    }
  };

  useEffect(() => {
    void refreshUsers();
    void refreshGroups();
  }, []);

  const submitUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUserSubmitting(true);
    setUserFormError("");
    setUserSuccess("");

    try {
      await createUser({
        nome: userForm.nome.trim(),
        email: userForm.email.trim(),
      });
      setUserForm({ nome: "", email: "" });
      setUserSuccess("Usuário cadastrado com sucesso.");
      await refreshUsers();
    } catch (error) {
      setUserFormError(errorMessage(error));
    } finally {
      setUserSubmitting(false);
    }
  };

  const submitGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGroupSubmitting(true);
    setGroupFormError("");
    setGroupSuccess("");

    try {
      await createGroup({ nome: groupForm.nome.trim() });
      setGroupForm({ nome: "" });
      setGroupSuccess("Grupo cadastrado com sucesso.");
      await refreshGroups();
    } catch (error) {
      setGroupFormError(errorMessage(error));
    } finally {
      setGroupSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
      <SectionTitle
        eyebrow="Comunidade Soul Up"
        title="Cadastre e consulte usuários e grupos"
        description="Crie seu perfil e forme grupos para transformar boas ideias em ações."
      />

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-forest-soft/80 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white">Usuários</h2>

          <form className="mt-6 space-y-5" onSubmit={submitUser}>
            <div>
              <label className={labelClass} htmlFor="user-name">
                Nome
              </label>
              <input
                id="user-name"
                autoComplete="name"
                required
                minLength={2}
                value={userForm.nome}
                onChange={(event) =>
                  setUserForm({ ...userForm, nome: event.target.value })
                }
                className={inputClass}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="user-email">
                E-mail
              </label>
              <input
                id="user-email"
                type="email"
                autoComplete="email"
                required
                value={userForm.email}
                onChange={(event) =>
                  setUserForm({ ...userForm, email: event.target.value })
                }
                className={inputClass}
                placeholder="voce@email.com"
              />
            </div>
            {userFormError && (
              <p role="alert" className="break-words text-sm text-red-300">
                {userFormError}
              </p>
            )}
            {userSuccess && (
              <p role="status" className="text-sm text-leaf">
                {userSuccess}
              </p>
            )}
            <button type="submit" className={buttonClass} disabled={userSubmitting}>
              {userSubmitting ? "Enviando..." : "Adicionar usuário"}
            </button>
          </form>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-white">Usuários cadastrados</h3>
              <button
                type="button"
                onClick={() => void refreshUsers()}
                disabled={usersLoading}
                className="text-sm font-semibold text-leaf hover:text-leaf-bright disabled:opacity-60"
              >
                Atualizar
              </button>
            </div>
            {usersLoading ? (
              <p className="mt-4 text-sm text-muted">Carregando usuários...</p>
            ) : usersError ? (
              <p role="alert" className="mt-4 break-words text-sm text-red-300">
                Não foi possível listar usuários: {usersError}
              </p>
            ) : users.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Nenhum usuário encontrado.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="rounded-2xl border border-white/10 bg-forest p-4"
                  >
                    <p className="font-semibold text-white">{user.nome}</p>
                    <p className="mt-1 break-all text-sm text-mint">{user.email}</p>
                    <p className="mt-2 text-xs text-muted">
                      ID {user.id}
                      {typeof user.pontosAdquiridos === "number" &&
                        ` · ${user.pontosAdquiridos} pontos`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-forest-soft/80 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white">Grupos</h2>

          <form className="mt-6 space-y-5" onSubmit={submitGroup}>
            <div>
              <label className={labelClass} htmlFor="group-name">
                Nome do grupo
              </label>
              <input
                id="group-name"
                required
                minLength={2}
                value={groupForm.nome}
                onChange={(event) =>
                  setGroupForm({ nome: event.target.value })
                }
                className={inputClass}
                placeholder="Ex.: Guardiões do bairro"
              />
            </div>

            {groupFormError && (
              <p role="alert" className="break-words text-sm text-red-300">
                {groupFormError}
              </p>
            )}
            {groupSuccess && (
              <p role="status" className="text-sm text-leaf">
                {groupSuccess}
              </p>
            )}
            <button
              type="submit"
              className={buttonClass}
              disabled={groupSubmitting}
            >
              {groupSubmitting ? "Enviando..." : "Adicionar grupo"}
            </button>
          </form>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-white">Grupos cadastrados</h3>
              <button
                type="button"
                onClick={() => void refreshGroups()}
                disabled={groupsLoading}
                className="text-sm font-semibold text-leaf hover:text-leaf-bright disabled:opacity-60"
              >
                Atualizar
              </button>
            </div>
            {groupsLoading ? (
              <p className="mt-4 text-sm text-muted">Carregando grupos...</p>
            ) : groupsError ? (
              <p role="alert" className="mt-4 break-words text-sm text-red-300">
                Não foi possível listar grupos: {groupsError}
              </p>
            ) : groups.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Nenhum grupo encontrado.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {groups.map((group) => (
                  <li
                    key={group.id}
                    className="rounded-2xl border border-white/10 bg-forest p-4"
                  >
                    <p className="font-semibold text-white">{group.nome}</p>
                    <p className="mt-1 text-sm text-mint">ID {group.id}</p>
                    {group.dataCriacao && (
                      <p className="mt-1 text-xs text-muted">
                        Criado em {group.dataCriacao}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
