import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import employeeAccess from "../server/employee-access.mjs";

let server;
let base;
before(async () => {
  server = createServer(employeeAccess);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}/api/acesso-funcionario`;
});
after(() => new Promise((resolve) => server.close(resolve)));

async function login(senha) {
  return fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ senha }) });
}

test("anonymous access and API user listing require a valid employee session", async () => {
  assert.equal((await fetch(base)).status, 401);
  assert.equal((await fetch(`${base}?recurso=usuarios`)).status, 401);
});

test("rejects incorrect passwords including eight-character prefix", async () => {
  for (const password of ["12345678", "123456780", "123456789 ", ""]) {
    const response = await login(password);
    assert.equal(response.status, 401);
    assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
  }
});

test("the exact requested password creates an HttpOnly session that survives refresh", async () => {
  const response = await login("123456789");
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.match(cookie, /Max-Age=28800/);
  assert.equal((await fetch(base, { headers: { Cookie: cookie.split(";")[0] } })).status, 200);
  const tampered = `${cookie.split(";")[0]}tampered`;
  assert.equal((await fetch(base, { headers: { Cookie: tampered } })).status, 401);
});

test("logout expires the session cookie", async () => {
  const response = await fetch(base, { method: "DELETE" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
});

test("rejects cross-origin login, malformed JSON, and unsupported methods", async () => {
  assert.equal((await fetch(base, { method: "POST", headers: { Origin: "https://other.example", "Content-Type": "application/json" }, body: JSON.stringify({ senha: "123456789" }) })).status, 403);
  assert.equal((await fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
  assert.equal((await fetch(base, { method: "PUT" })).status, 405);
});
