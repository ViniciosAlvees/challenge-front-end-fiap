export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const environment = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;

function getApiUrl(path: string): URL {
  const base = environment?.VITE_API_BASE_URL?.trim() || "/api";
  return new URL(path.replace(/^\/+/, ""), new URL(`${base.replace(/\/$/, "")}/`, window.location.origin));
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  const writing = init.method !== undefined && init.method !== "GET";
  const uncertainWrite = writing ? " Consulte os registros antes de repetir: a operação pode ter sido recebida." : "";
  let response: Response;
  try {
    response = await fetch(getApiUrl(path), {
      credentials: "include", ...init,
      signal: init.signal ?? AbortSignal.timeout(45000),
      headers: { Accept: "application/json", ...init.headers },
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new Error(`Não foi possível conectar à API. Verifique sua conexão e tente novamente.${uncertainWrite}`);
  }
  const content = await response.text();
  if (!response.ok) {
    const messages: Record<number, string> = {
      400: "Os dados enviados não foram aceitos. Confira os campos.",
      401: "E-mail ou senha incorretos, ou sessão expirada.",
      403: "Você não tem permissão para realizar esta operação.",
      404: "O registro ou serviço solicitado não foi encontrado.",
      409: "Já existe um registro com esses dados ou há um vínculo que impede a operação.",
      429: "Muitas solicitações. Aguarde antes de tentar novamente.",
    };
    throw new ApiError(messages[response.status] ?? `O serviço retornou HTTP ${response.status}. Tente novamente mais tarde.`, response.status);
  }
  if (!content.trim()) return null;
  try { return JSON.parse(content) as T; }
  catch { throw new Error(`A API retornou uma resposta inválida.${uncertainWrite}`); }
}

export function apiGet<T>(path: string): Promise<T | null> { return request<T>(path); }
export function apiPost<T, TBody>(path: string, body: TBody, init: RequestInit = {}): Promise<T | null> {
  return request<T>(path, { ...init, method: "POST", headers: { "Content-Type": "application/json", ...init.headers }, body: JSON.stringify(body) });
}
export function apiPut<T, TBody>(path: string, body: TBody): Promise<T | null> {
  return request<T>(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
export function apiPatch<T, TBody>(path: string, body: TBody): Promise<T | null> {
  return request<T>(path, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
export async function apiDelete(path: string): Promise<null> {
  await request<unknown>(path, { method: "DELETE" });
  return null;
}

export type AccountCredentials = { email: string; senha: string };
export type RegisterAccountRequest = AccountCredentials & { nome: string };
export type CreateUserRequest = RegisterAccountRequest;
export type AccountUser = { id: number; nome: string; email: string; pontosAdquiridos?: number; pontuacao?: number };
export type ApiUser = Pick<AccountUser, "id" | "nome" | "email"> & { pontosAdquiridos?: number };
export type CreateGroupRequest = { nome: string; membros?: { id: number }[] };
export type ApiGroup = { id: number; nome: string; dataCriacao?: string; pontosAcumulados?: number; membros?: ApiUser[]; nivel?: string };
export type ApiChallenge = { id: number; titulo: string; descricao: string; pontos: number; categoria: string };

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("A API retornou um registro inválido.");
  return value as Record<string, unknown>;
}
function identifier(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) throw new Error("A API retornou um identificador inválido.");
  return value;
}
function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("A API retornou um campo obrigatório inválido.");
  return value;
}
function points(value: unknown): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new Error("A API retornou uma pontuação inválida.");
  return value;
}
export function parseApiUser(value: unknown): ApiUser {
  const user = record(value);
  return { id: identifier(user.id ?? user.id_usuario), nome: text(user.nome), email: text(user.email), pontosAdquiridos: points(user.pontosAdquiridos ?? user.pontos ?? user.pontuacao) };
}
function parseApiGroup(value: unknown): ApiGroup {
  const group = record(value);
  if (group.membros != null && !Array.isArray(group.membros)) throw new Error("A API retornou membros em formato inválido.");
  return {
    id: identifier(group.id ?? group.id_grupo), nome: text(group.nome),
    dataCriacao: typeof (group.dataCriacao ?? group.data_criacao) === "string" ? String(group.dataCriacao ?? group.data_criacao) : undefined,
    pontosAcumulados: points(group.pontosAcumulados ?? group.pontos),
    membros: Array.isArray(group.membros) ? group.membros.map(parseApiUser) : undefined,
    nivel: typeof group.nivel === "string" ? group.nivel : undefined,
  };
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("A API não retornou uma lista válida.");
  return value;
}

// Cache de apresentação. A autorização sempre é confirmada em /auth/me.
const accountStorageKey = "soul-up:account:v2";
export function getStoredAccount(): AccountUser | null {
  const stored = sessionStorage.getItem(accountStorageKey);
  if (!stored) return null;
  try { return parseApiUser(JSON.parse(stored)); }
  catch { sessionStorage.removeItem(accountStorageKey); return null; }
}
export function storeAccount(account: AccountUser): void { sessionStorage.setItem(accountStorageKey, JSON.stringify(account)); }
export function clearStoredAccount(): void {
  sessionStorage.removeItem(accountStorageKey);
  sessionStorage.removeItem("soul-up:account");
}
function authError(cause: unknown): never {
  if (cause instanceof ApiError && [404, 405, 501].includes(cause.status)) {
    throw new ApiError("O servidor ainda não disponibiliza autenticação com senha. A API Java precisa implementar /auth/login e /auth/me.", cause.status);
  }
  throw cause;
}
export async function registerAccount(account: RegisterAccountRequest): Promise<AccountUser> {
  const response = await apiPost<unknown, RegisterAccountRequest>("/usuarios", account);
  if (!response) throw new Error("A API não confirmou os dados do cadastro. Consulte os registros antes de tentar novamente.");
  return parseApiUser(response);
}
export async function login(credentials: AccountCredentials): Promise<AccountUser> {
  clearStoredAccount();
  try {
    await apiPost<unknown, AccountCredentials>("/auth/login", credentials);
    // Uma resposta 200 no login, sozinha, não comprova uma sessão autenticada.
    const account = parseApiUser(await apiGet<unknown>("/auth/me"));
    storeAccount(account);
    return account;
  } catch (cause) { return authError(cause); }
}
export async function getCurrentAccount(): Promise<AccountUser | null> {
  try {
    const account = parseApiUser(await apiGet<unknown>("/auth/me"));
    storeAccount(account);
    return account;
  } catch (cause) {
    clearStoredAccount();
    if (cause instanceof ApiError && cause.status === 401) return null;
    return authError(cause);
  }
}
export async function logout(): Promise<null> {
  await request<unknown>("/auth/logout", { method: "POST" });
  clearStoredAccount();
  return null;
}
export async function listUsers(): Promise<ApiUser[]> { return list(await apiGet<unknown>("/usuarios")).map(parseApiUser); }
export async function getUser(id: number): Promise<ApiUser> {
  identifier(id);
  // A listagem é o contrato disponível do Java; o detalhe usa dados reais dela.
  const user = (await listUsers()).find((item) => item.id === id);
  if (!user) throw new ApiError("Usuário não encontrado na API.", 404);
  return user;
}
export const deleteUser = (id: number) => apiDelete(`/usuarios?id=${identifier(id)}`);
export async function createGroup(group: CreateGroupRequest): Promise<ApiGroup> {
  const response = await apiPost<unknown, CreateGroupRequest>("/grupos", group);
  try { return parseApiGroup(response); }
  catch { throw new Error("O servidor não confirmou um identificador válido para o grupo. Consulte os grupos antes de repetir o cadastro."); }
}
export async function listGroups(): Promise<ApiGroup[]> { return list(await apiGet<unknown>("/grupos")).map(parseApiGroup); }
export async function getGroup(id: number): Promise<ApiGroup> {
  identifier(id);
  const group = (await listGroups()).find((item) => item.id === id);
  if (!group) throw new ApiError("Grupo não encontrado na API.", 404);
  return group;
}
export const deleteGroup = (id: number) => apiDelete(`/grupos?id=${identifier(id)}`);
export async function listChallenges(): Promise<ApiChallenge[]> {
  return list(await apiGet<unknown>("/desafios")).map((value) => {
    const challenge = record(value);
    return { id: identifier(challenge.id ?? challenge.id_desafio), titulo: text(challenge.titulo ?? challenge.descricao), descricao: text(challenge.descricao), pontos: points(challenge.pontos), categoria: text(challenge.categoria) };
  });
}
