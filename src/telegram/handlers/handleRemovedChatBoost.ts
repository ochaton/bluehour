import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleRemovedChatBoost(env: Env, removedChatBoost: tgTypes.ChatBoostRemoved) {
    console.log(removedChatBoost);
}
