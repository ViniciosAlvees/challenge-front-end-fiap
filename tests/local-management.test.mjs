import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import {
  createLocalChallenge,
  decideLocalAction,
  getCompletedChallengeIds,
  getChallengePoints,
  getLocalActions,
  getLocalChallenges,
  getLocalRanking,
  publishLocalAction,
  toggleLocalChallenge,
} from "../src/services/challenges.ts";

const values = new Map();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  },
  configurable: true,
});
const ana = { id: 1, nome: "Ana", email: "ana@example.test" };
const bia = { id: 2, nome: "Bia", email: "bia@example.test" };
beforeEach(() => values.clear());

test("creates and toggles challenges while preserving IDs and history", () => {
  const challenge = createLocalChallenge(
    "Reciclar garrafas de vidro",
    "Reciclagem",
    200,
  );
  assert.equal(challenge.id, 7);
  toggleLocalChallenge(challenge.id);
  assert.equal(
    getLocalChallenges().find((item) => item.id === challenge.id).active,
    false,
  );
  assert.throws(
    () => publishLocalAction(ana, challenge.id, "Evidência válida"),
    /ativo não encontrado/,
  );
  toggleLocalChallenge(challenge.id);
  assert.equal(
    getLocalChallenges().find((item) => item.id === challenge.id).active,
    true,
  );
});

test("only approved actions count, with no duplicate submissions or second review", () => {
  const action = publishLocalAction(
    ana,
    1,
    "Separei resíduos durante cinco dias",
  );
  publishLocalAction(bia, 2, "Participei da limpeza de uma praça");
  assert.equal(getLocalRanking()[0].points, 0);
  assert.deepEqual(getCompletedChallengeIds(ana.id), []);
  assert.throws(
    () => publishLocalAction(ana, 1, "Evidência duplicada"),
    /já enviou/,
  );
  assert.throws(() => decideLocalAction(action.id, true, "ok"), /pelo menos 5/);
  decideLocalAction(action.id, true, "Evidência aprovada");
  assert.deepEqual(getCompletedChallengeIds(ana.id), [1]);
  assert.equal(getChallengePoints(getCompletedChallengeIds(ana.id)), 100);
  decideLocalAction(2, false, "Evidência insuficiente");
  assert.deepEqual(
    getLocalRanking().map((entry) => [entry.name, entry.points]),
    [
      ["Ana", 100],
      ["Bia", 0],
    ],
  );
  assert.throws(
    () => decideLocalAction(action.id, false, "Segunda decisão"),
    /já analisada/,
  );
  toggleLocalChallenge(1);
  assert.equal(getLocalActions()[0].status, "aprovada");
  assert.equal(getLocalRanking()[0].points, 100);
});

test("validates challenge fields and preserves preexisting completed challenges", () => {
  for (const points of [0, -1, 1.5, 10001, NaN])
    assert.throws(() =>
      createLocalChallenge("Desafio válido", "Geral", points),
    );
  assert.throws(() => createLocalChallenge("   ", "Geral", 100));
  values.set("soul-up:completed-challenges:1", "[1,2]");
  assert.equal(getChallengePoints(getCompletedChallengeIds(1)), 350);
});
