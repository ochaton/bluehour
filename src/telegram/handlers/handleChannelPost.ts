import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleChannelPost(env: Env, channelPost: tgTypes.Message) {
    console.log(channelPost);
}
