import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleInlineQuery(env: Env, inlineQuery: tgTypes.InlineQuery) {
	// we expect here only to read location:
	console.log(inlineQuery);
	const location = inlineQuery.location;
	if (location) {
		await tg.sendMessage(env, {
			chat_id: inlineQuery.from.id,
			text: `Received your location: Latitude ${location.latitude}, Longitude ${location.longitude}`,
		}).catch((error) => {
			console.log(`Error sending message: ${error}`);
			return;
		})
		return;
	}
	// just skip others:
}
