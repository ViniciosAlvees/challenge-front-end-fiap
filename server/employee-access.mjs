import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const cookieName = "soulup_employee";
const sessionDuration = 8 * 60 * 60;
const password = process.env.EMPLOYEE_PASSWORD || "123456789";
const signingKey = scryptSync(password, "soul-up:employee-session:v1", 32);
const passwordDigest = createHmac("sha256", signingKey).update(password).digest();

function sign(value) {
  return createHmac("sha256", signingKey).update(value).digest("base64url");
}

function authenticated(req) {
  const cookie = (req.headers.cookie || "").split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!cookie) return false;
  const [expires, nonce, signature, extra] = cookie.split(".");
  if (!expires || !nonce || !signature || extra || Number(expires) <= Date.now()) return false;
  const expected = Buffer.from(sign(`${expires}.${nonce}`));
  const received = Buffer.from(signature);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function setCookie(req, res, value, age) {
  const secure = req.headers["x-forwarded-proto"] === "https" || req.socket?.encrypted;
  res.setHeader("Set-Cookie", `${cookieName}=${value}; HttpOnly; SameSite=Strict; Path=/api/acesso-funcionario; Max-Age=${age}${secure ? "; Secure" : ""}`);
}

export default async function employeeAccess(req, res) {
  try {
    if (["POST", "DELETE"].includes(req.method)) {
      const origin = req.headers.origin;
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      if (origin && new URL(origin).host !== host) {
        return send(res, 403, { message: "Origem não autorizada." });
      }
    }

    if (req.method === "POST") {
      if (!req.headers["content-type"]?.startsWith("application/json")) {
        return send(res, 415, { message: "Envie a senha em formato JSON." });
      }
      let body = req.body;
      if (body === undefined) {
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          if (raw.length > 4096) return send(res, 413, { message: "Requisição muito grande." });
        }
        body = JSON.parse(raw);
      } else if (typeof body === "string") {
        body = JSON.parse(body);
      }
      const candidate = typeof body?.senha === "string" ? body.senha : "";
      const digest = createHmac("sha256", signingKey).update(candidate).digest();
      if (!timingSafeEqual(digest, passwordDigest)) {
        setCookie(req, res, "", 0);
        return send(res, 401, { message: "Senha incorreta. Tente novamente." });
      }
      const value = `${Date.now() + sessionDuration * 1000}.${randomBytes(24).toString("base64url")}`;
      setCookie(req, res, `${value}.${sign(value)}`, sessionDuration);
      return send(res, 200, { authenticated: true });
    }

    if (req.method === "DELETE") {
      setCookie(req, res, "", 0);
      return send(res, 200, { authenticated: false });
    }

    if (req.method !== "GET") {
      res.setHeader("Allow", "GET, POST, DELETE");
      return send(res, 405, { message: "Método não permitido." });
    }
    if (!authenticated(req)) return send(res, 401, { message: "Informe a senha de funcionário para continuar." });

    const url = new URL(req.url, "http://localhost");
    if (url.searchParams.get("recurso") === "usuarios") {
      const base = (process.env.SOULUP_API_URL || "https://challeng-sprin4-java.onrender.com").replace(/\/$/, "");
      const response = await fetch(`${base}/usuarios`, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(45000) });
      if (!response.ok) return send(res, 502, { message: `A API de usuários retornou HTTP ${response.status}.` });
      const users = await response.json();
      if (!Array.isArray(users) || users.some((user) => !user || typeof user !== "object")) {
        return send(res, 502, { message: "A API não retornou uma lista de usuários válida." });
      }
      return send(res, 200, users.map((user, index) => ({ id: user.id ?? user.id_usuario ?? index + 1, nome: user.nome || "Usuário sem nome", email: user.email || "Sem e-mail" })));
    }
    return send(res, 200, { authenticated: true });
  } catch (error) {
    return send(res, error instanceof SyntaxError ? 400 : 502, {
      message: error instanceof SyntaxError ? "Requisição inválida." : "Não foi possível consultar o serviço. Tente novamente.",
    });
  }
}
