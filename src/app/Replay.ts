export type ActionLogItem = { playerId: number; action: string; amount?: number; time: number };
export type HandReplay = { seed: string; actions: ActionLogItem[] };
