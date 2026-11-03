import assert from "node:assert/strict";
import { beforeEach, afterEach, test } from "node:test";
import { ApiError, login, getCurrentAccount, getStoredAccount, listUsers, getUser, listGroups, getGroup, createGroup, deleteUser, deleteGroup } from "../src/services/api.ts";

const originalFetch = globalThis.fetch;
const storage = new Map();
Object.defineProperty(globalThis, "sessionStorage", { value: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) }, configurable: true });
globalThis.window = { location: { origin: "http://localhost:5173" } };
const user = { id: 1, nome: "Ana", email: "ana@example.test", pontosAdquiridos: 100 };
const group = { id: 7, nome: "Guardiões", membros: [user] };
let calls;
beforeEach(() => { storage.clear(); calls = []; });
afterEach(() => { globalThis.fetch = originalFetch; });
function mock(responses) {
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), ...options });
    const next = responses.shift();
    assert.ok(next, "Requisição adicional inesperada");
    return new Response(next.status === 204 ? null : next.body === undefined ? "" : JSON.stringify(next.body), { status: next.status ?? 200 });
  };
}

test("wrong password never falls back to a public email lookup", async () => {
  mock([{ status: 401, body: { message: "invalid" } }]);
  await assert.rejects(login({ email: user.email, senha: "wrong-password" }), (error) => error instanceof ApiError && error.status === 401);
  assert.equal(calls.length, 1); assert.match(calls[0].url, /auth\/login$/); assert.equal(getStoredAccount(), null);
});
test("missing auth route fails closed without an email-only fallback", async () => {
  mock([{ status: 404 }]);
  await assert.rejects(login({ email: user.email, senha: "any-password" }), /ainda não disponibiliza autenticação/);
  assert.equal(calls.length, 1);
});
test("successful login must also be confirmed by the server session endpoint", async () => {
  mock([{ body: user }, { body: user }]);
  assert.deepEqual(await login({ email: user.email, senha: "correct-password" }), user);
  assert.match(calls[1].url, /auth\/me$/); assert.equal(calls[0].credentials, "include");
  assert.deepEqual(getStoredAccount(), user);
});
test("a login response without an authenticated session does not log in", async () => {
  mock([{ body: user }, { status: 401 }]);
  await assert.rejects(login({ email: user.email, senha: "incorrect-password" }));
  assert.equal(getStoredAccount(), null);
});
test("a forged local account does not authenticate the user", async () => {
  storage.set("soul-up:account:v2", JSON.stringify(user));
  mock([{ status: 401 }]);
  assert.equal(await getCurrentAccount(), null); assert.equal(getStoredAccount(), null);
});
test("user and group details are selected from current API records, including 404", async () => {
  mock([{ body: [user] }, { body: [group] }, { body: [] }]);
  assert.deepEqual(await getUser(1), user);
  assert.equal((await getGroup(7)).membros[0].id, 1);
  await assert.rejects(getUser(999), (error) => error.status === 404);
});
test("rejects malformed lists and records instead of fabricating IDs or dates", async () => {
  mock([{ body: [{ nome: "Sem ID", email: user.email }] }, { body: null }, { body: [{ id: 7, nome: "Grupo" }] }]);
  await assert.rejects(listUsers(), /identificador inválido/);
  await assert.rejects(listGroups(), /lista válida/);
  assert.equal((await listGroups())[0].dataCriacao, undefined);
});
test("backend failures remain failures and do not become empty lists", async () => {
  mock([{ status: 500, body: "sensitive SQL error" }]);
  await assert.rejects(listUsers(), (error) => error.status === 500 && !error.message.includes("SQL"));
});
test("group creation sends selected members and verifies a real identifier", async () => {
  mock([{ status: 201, body: group }]);
  assert.equal((await createGroup({ nome: group.nome, membros: [{ id: 1 }] })).id, 7);
  assert.deepEqual(JSON.parse(calls[0].body).membros, [{ id: 1 }]);
});
test("deletion follows the Java query parameter contract", async () => {
  mock([{ status: 204 }, { status: 204 }]);
  await deleteUser(1); await deleteGroup(7);
  assert.match(calls[0].url, /usuarios\?id=1$/); assert.match(calls[1].url, /grupos\?id=7$/);
  assert.ok(calls.every((call) => call.method === "DELETE"));
});
