import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handlePoll(env: Env, poll: tgTypes.Poll) {
    console.log(poll);
}
