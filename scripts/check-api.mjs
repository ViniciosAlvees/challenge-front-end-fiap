const base = (process.env.SOULUP_API_URL || "https://challeng-sprin4-java.onrender.com").replace(/\/$/, "");
const endpoints = process.argv.includes("--discover") ? ["/usuarios", "/grupos", "/desafios", "/v3/api-docs", "/swagger.json"] : ["/usuarios", "/grupos"];
const results = await Promise.all(endpoints.map(async (path) => {
  try {
    const response = await fetch(`${base}${path}`, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(45000) });
    const content = await response.text();
    let body;
    try { body = JSON.parse(content); } catch { /* Pode retornar HTML em caso de falha. */ }
    return { path, status: response.status, json: body !== undefined, ...(Array.isArray(body) ? { registros: body.length } : {}), ...(body?.paths ? { endpoints: Object.keys(body.paths) } : {}) };
  } catch (cause) { return { path, error: cause.message, cause: cause.cause?.code }; }
}));
console.log(JSON.stringify({ base, results }, null, 2));
if (results.some((result) => result.error || result.status < 200 || result.status >= 300 || !result.json)) process.exitCode = 1;
