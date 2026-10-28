export type SustainableChallenge = {
  id: number;
  category: string;
  description: string;
  points: number;
};

export const sustainableChallenges: SustainableChallenge[] = [
  {
    id: 1,
    category: "Reciclagem",
    description: "Separar resíduos recicláveis por 5 dias",
    points: 100,
  },
  {
    id: 2,
    category: "Limpeza de Praças",
    description: "Participar da limpeza de uma praça local",
    points: 250,
  },
  {
    id: 3,
    category: "Economia de Energia",
    description: "Desligar aparelhos sem uso durante uma semana",
    points: 150,
  },
  {
    id: 4,
    category: "Plantio de Árvores",
    description: "Plantar uma árvore em local permitido",
    points: 300,
  },
  {
    id: 5,
    category: "Reciclagem",
    description: "Separar plástico, papel e vidro corretamente",
    points: 120,
  },
  {
    id: 6,
    category: "Economia de Energia",
    description: "Trocar lâmpadas comuns por LED",
    points: 180,
  },
];

function getStorageKey(userId: number | null): string {
  return `soul-up:completed-challenges:${userId ?? "visitante"}`;
}

export function getCompletedChallengeIds(userId: number | null): number[] {
  const storedValue = localStorage.getItem(getStorageKey(userId));
  if (!storedValue) return [];

  const parsedValue: unknown = JSON.parse(storedValue);
  if (
    !Array.isArray(parsedValue) ||
    !parsedValue.every((id) => typeof id === "number")
  ) {
    throw new Error("Não foi possível ler os desafios concluídos salvos.");
  }

  return parsedValue;
}

export function completeChallenge(userId: number | null, challengeId: number) {
  const completedIds = getCompletedChallengeIds(userId);
  if (!completedIds.includes(challengeId)) {
    localStorage.setItem(
      getStorageKey(userId),
      JSON.stringify([...completedIds, challengeId]),
    );
  }
}

export function getChallengePoints(completedIds: number[]): number {
  return sustainableChallenges.reduce(
    (total, challenge) =>
      completedIds.includes(challenge.id) ? total + challenge.points : total,
    0,
  );
}
