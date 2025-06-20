import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleMessageReaction(env: Env, messageReaction: tgTypes.MessageReactionUpdated) {
    console.log(messageReaction);
}
