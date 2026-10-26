export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getApiUrl(path: string): URL {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL?.trim() || "/api";
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const resolvedBaseUrl = new URL(normalizedBaseUrl, window.location.origin);
  return new URL(path.replace(/^\/+/, ""), resolvedBaseUrl);
}

async function request<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse | null> {
  const response = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new ApiError(
      responseText || `A API retornou o status ${response.status}.`,
      response.status,
    );
  }

  if (!responseText) return null;

  try {
    return JSON.parse(responseText) as TResponse;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "resposta inválida";
    throw new Error(`Não foi possível interpretar a resposta da API: ${reason}`);
  }
}

export function apiGet<TResponse>(path: string): Promise<TResponse | null> {
  return request<TResponse>(path);
}

export function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse | null> {
  return request<TResponse>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export type CreateUserRequest = {
  id: number;
  nome: string;
  email: string;
};

export type CreateGroupRequest = {
  nome: string;
};

export type ApiUser = {
  id: number;
  nome: string;
  email: string;
  pontosAdquiridos?: number;
};

export type ApiGroup = {
  id: number;
  nome: string;
  dataCriacao?: string;
  pontosAcumulados?: number;
  nivel?: string;
};

export function createUser(
  user: CreateUserRequest,
): Promise<ApiUser | null> {
  return apiPost<ApiUser, CreateUserRequest>("/usuarios", user);
}

export function createGroup(
  group: CreateGroupRequest,
): Promise<ApiGroup | null> {
  return apiPost<ApiGroup, CreateGroupRequest>("/grupos", group);
}

export async function listUsers(): Promise<ApiUser[]> {
  const response = await apiGet<unknown>("/usuarios");
  if (!Array.isArray(response)) {
    throw new Error("A API não retornou uma lista de usuários válida.");
  }

  return response.map((user, index) => {
    if (
      typeof user !== "object" ||
      user === null ||
      !("id" in user) ||
      typeof user.id !== "number" ||
      !("nome" in user) ||
      typeof user.nome !== "string" ||
      !("email" in user) ||
      typeof user.email !== "string"
    ) {
      throw new Error(
        `O usuário ${index + 1} retornado pela API não contém id, nome e email válidos.`,
      );
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      ...("pontosAdquiridos" in user &&
      typeof user.pontosAdquiridos === "number"
        ? { pontosAdquiridos: user.pontosAdquiridos }
        : {}),
    };
  });
}

export async function listGroups(): Promise<ApiGroup[]> {
  const response = await apiGet<unknown>("/grupos");
  if (!Array.isArray(response)) {
    throw new Error("A API não retornou uma lista de grupos válida.");
  }

  return response.map((group, index) => {
    if (
      typeof group !== "object" ||
      group === null ||
      !("id" in group) ||
      typeof group.id !== "number" ||
      !("nome" in group) ||
      typeof group.nome !== "string"
    ) {
      throw new Error(
        `O grupo ${index + 1} retornado pela API não contém id e nome válidos.`,
      );
    }

    return {
      id: group.id,
      nome: group.nome,
      ...("dataCriacao" in group &&
      typeof group.dataCriacao === "string"
        ? { dataCriacao: group.dataCriacao }
        : {}),
      ...("pontosAcumulados" in group &&
      typeof group.pontosAcumulados === "number"
        ? { pontosAcumulados: group.pontosAcumulados }
        : {}),
      ...("nivel" in group && typeof group.nivel === "string"
        ? { nivel: group.nivel }
        : {}),
    };
  });
}

export function apiPut<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse | null> {
  return request<TResponse>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiPatch<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse | null> {
  return request<TResponse>(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiDelete(path: string): Promise<null> {
  return request<never>(path, { method: "DELETE" });
}
