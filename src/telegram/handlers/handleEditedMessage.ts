import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleEditedMessage(env: Env, editedMessage: tgTypes.Message) {
    console.log(editedMessage);
}
