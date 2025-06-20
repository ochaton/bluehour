import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleChosenInlineResult(env: Env, chosenInlineResult: tgTypes.ChosenInlineResult) {
    console.log(chosenInlineResult);
}
