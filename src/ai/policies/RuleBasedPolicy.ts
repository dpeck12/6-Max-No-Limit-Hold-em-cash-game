import { BotPolicy, BotContext } from '../BotPolicy';
import { Action } from '../../engine/types/Action';
export class RuleBasedPolicy implements BotPolicy {
  decide(ctx: BotContext): Action {
    const toMatch = ctx.currentBet - ctx.contribution;
    if (toMatch > 0) return { type: 'call' };
    return { type: 'check' };
  }
}