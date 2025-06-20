import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleInlineQuery(env: Env, inlineQuery: tgTypes.InlineQuery) {
    console.log(inlineQuery);
}
