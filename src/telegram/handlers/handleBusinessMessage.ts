import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleBusinessMessage(env: Env, businessMessage: tgTypes.Message) {
    console.log(businessMessage);
}
