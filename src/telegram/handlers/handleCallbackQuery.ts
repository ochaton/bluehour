import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleCallbackQuery(env: Env, callbackQuery: tgTypes.CallbackQuery) {
    console.log(callbackQuery);
}
