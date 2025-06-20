import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handlePreCheckoutQuery(env: Env, preCheckoutQuery: tgTypes.PreCheckoutQuery) {
    console.log(preCheckoutQuery);
}
