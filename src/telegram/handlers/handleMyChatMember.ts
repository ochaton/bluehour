import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleMyChatMember(env: Env, myChatMember: tgTypes.ChatMemberUpdated) {
    console.log(myChatMember);
}
