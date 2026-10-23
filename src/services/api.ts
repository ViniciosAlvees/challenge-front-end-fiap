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
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      "API não configurada. Defina VITE_API_BASE_URL no arquivo .env.local.",
    );
  }

  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(path.replace(/^\/+/, ""), normalizedBaseUrl);
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
