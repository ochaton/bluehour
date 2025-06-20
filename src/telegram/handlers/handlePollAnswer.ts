import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handlePollAnswer(env: Env, pollAnswer: tgTypes.PollAnswer) {
    console.log(pollAnswer);
}
