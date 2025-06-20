import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleShippingQuery(env: Env, shippingQuery: tgTypes.ShippingQuery) {
    console.log(shippingQuery);
}
