import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleChatJoinRequest(env: Env, chatJoinRequest: tgTypes.ChatJoinRequest) {
    console.log(chatJoinRequest);
}
