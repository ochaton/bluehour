import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleChatMember(env: Env, chatMember: tgTypes.ChatMemberUpdated) {
    console.log(chatMember);
}
