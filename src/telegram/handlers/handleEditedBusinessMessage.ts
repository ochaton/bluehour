import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleEditedBusinessMessage(env: Env, editedBusinessMessage: tgTypes.Message) {
    console.log(editedBusinessMessage);
}
