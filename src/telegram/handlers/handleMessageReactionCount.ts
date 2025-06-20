import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleMessageReactionCount(env: Env, messageReactionCount: tgTypes.MessageReactionCountUpdated) {
    console.log(messageReactionCount);
}
