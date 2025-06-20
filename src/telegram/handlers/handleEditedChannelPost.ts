import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleEditedChannelPost(env: Env, editedChannelPost: tgTypes.Message) {
    console.log(editedChannelPost);
}
