import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleBusinessConnection(env: Env, businessConnection: tgTypes.BusinessConnection) {
    console.log(businessConnection);
}
