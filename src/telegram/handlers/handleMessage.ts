import { tg } from '../lib/methods';
import { Env } from '../env';
import { getTimes, GetTimesResult } from "suncalc";
import tzlookup from "@photostructure/tz-lookup";

export async function handleMessage(env: Env, message: tgTypes.Message) {
	const messageText: string = message.text || '';

	if (message.location) {
		return await handleLocationChange(env, message);
	}

	// switch case to handle different commands
	switch (messageText) {
		case '/help':
			return await handleHelpCommand(env, message);
		case '/change_location':
			return await handleChangeLocationCommand(env, message);
		default:
			break;
	}

	await tg.sendMessage(env, {
		chat_id: message.chat.id,
		text: `Hello, ${message.from?.first_name}! Welcome to the bot. Use /help to see available commands.`,
		reply_markup: {
			remove_keyboard: true,
		},
	}).catch((error) => {
		console.log(`Error sending message: ${error}`)
		return
	})
}

const helpMessage: string = `Available commands:
/help - Show this help message
/start - Start the bot
/change_location - Change your location`;

async function handleHelpCommand(env: Env, message: tgTypes.Message) {
	await tg.sendMessage(env, {
		chat_id: message.chat.id,
		text: helpMessage,
	}).catch((error) => {
		console.log(`Error sending help message: ${error}`)
		return
	});
}

async function handleChangeLocationCommand(env: Env, message: tgTypes.Message) {
	await tg.sendMessage(env, {
		chat_id: message.chat.id,
		text: 'Please send your new location.',
		reply_markup: {
			keyboard: [[{ text: 'Send Location', request_location: true }]],
			resize_keyboard: true,
			one_time_keyboard: true,
		},
	}).catch((error) => {
		console.log(`Error sending change location message: ${error}`)
		return
	});
}

export type Location = {
	latitude: number;
	longitude: number;
	accuracy?: number; // Optional, if available
}

function formatDate(date: Date, timeZone: string): string {
	const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const get = (type: string) => parts.find(p => p.type === type)?.value.padStart(2, '0');
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
}

function formatDates(dates: Date[], timeZone: string): string[] {
  return dates.map(date => formatDate(date, timeZone));
}

// This function process user's location
async function handleLocationChange(env: Env, message: tgTypes.Message) {
	if (!message.location) {
		console.log('No location provided in the message.');
		return;
	}

	// Key to store in KV
	const chat_id: number = message.chat.id;
	const location: Location = {
		latitude: message.location.latitude,
		longitude: message.location.longitude,
		accuracy: message.location.horizontal_accuracy, // Optional, if available
	}

	// notification settings:
	// - night
	// - astronomical twilight
	// - nautical twilight (blue hour)
	// - sunrise
	// - golden hour

	// - day

	// - golden hour
	// - sunset
	// - nautical twilight (blue hour)
	// - astronomical twilight
	// - night

	const tz: string = tzlookup(location.latitude, location.longitude);
	const sunTimes: GetTimesResult = getTimes(new Date(), location.latitude, location.longitude);
	// const moonTimes: GetTimesResult = getMoonTimes(new Date(), location.latitude, location.longitude);

	// const kv: KVNamespace = env.getKv();
	// kv.put(`loc:${chat_id}`, "", {
	// 	metadata: {
	// 		latitude: location.latitude,
	// 		longitude: location.longitude,
	// 		accuracy: location.accuracy || 0, // Default to 0 if not provided
	// 	},
	// })

	const messageText: string = `Location updated successfully! Here are the details:
Latitude: ${location.latitude}
Longitude: ${location.longitude}
Accuracy: ${location.accuracy || 'N/A'} meters

NightEnd: ${formatDate(sunTimes.nightEnd, tz)}
BlueHour: ${formatDate(sunTimes.nauticalDawn, tz)}
Dawn: ${formatDate(sunTimes.dawn, tz)}
Sunrise: ${formatDate(sunTimes.sunrise, tz)} - ${formatDate(sunTimes.sunriseEnd, tz)}
Golden HourEnd: ${formatDate(sunTimes.goldenHourEnd, tz)}

Golden Hour: ${formatDate(sunTimes.goldenHour, tz)}
Sunset: ${formatDate(sunTimes.sunsetStart, tz)} - ${formatDate(sunTimes.sunset, tz)}
Dusk: ${formatDate(sunTimes.dusk, tz)}
BlueHour: ${formatDate(sunTimes.nauticalDusk, tz)}
Night: ${formatDate(sunTimes.night, tz)}`;

	await tg.sendMessage(env, {
		chat_id: message.chat.id,
		text: messageText,
		reply_markup: {
			remove_keyboard: true,
		},
	}).catch((error) => {
		console.log(`Error sending location message: ${error}`);
		return;
	})

	return;
}
