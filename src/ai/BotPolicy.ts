import { Action } from '../engine/types/Action';
export type BotContext = { currentBet: number; contribution: number };
export interface BotPolicy { decide(ctx: BotContext): Action }
