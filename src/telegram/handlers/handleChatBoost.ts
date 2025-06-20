import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleChatBoost(env: Env, chatBoost: tgTypes.ChatBoostUpdated) {
    console.log(chatBoost);
}
