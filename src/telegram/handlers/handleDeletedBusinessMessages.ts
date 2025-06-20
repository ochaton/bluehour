import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleDeletedBusinessMessages(env: Env, deletedBusinessMessages: tgTypes.BusinessMessagesDeleted) {
    console.log(deletedBusinessMessages);
}
