import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleMessage(env: Env, message: tgTypes.Message) {
    console.log(message);
}
