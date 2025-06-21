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
	if (typeof date !== 'object' || !(date instanceof Date) || date.toString() === 'Invalid Date') {
		return "Invalid date";
	}
	console.log(`Formatting date: ${date} in timezone: ${timeZone}`);
	const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone,
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

	const tz: string = tzlookup(location.latitude, location.longitude);
	const sunTimes: GetTimesResult = getTimes(new Date(), location.latitude, location.longitude);

	const tzf = (d: Date) => {
		return formatDate(d, tz);
	};

	let times = new Map([
		['nightEnd', sunTimes.nightEnd],
		['nauticalDawn', sunTimes.nauticalDawn],
		['dawn', sunTimes.dawn],
		['sunrise', sunTimes.sunrise],
		['sunriseEnd', sunTimes.sunriseEnd],
		['goldenHourEnd', sunTimes.goldenHourEnd],
		['goldenHour', sunTimes.goldenHour],
		['sunsetStart', sunTimes.sunsetStart],
		['sunset', sunTimes.sunset],
		['dusk', sunTimes.dusk],
		['nauticalDusk', sunTimes.nauticalDusk],
		['night', sunTimes.night],
	])

	// filter all Invalid dates:
	for (let [key, value] of times) {
		if (value instanceof Date && value.toString() === 'Invalid Date') {
			times.delete(key);
		}
	}

	const messageText: string = `Location updated successfully! Here are the details:\n` +
		`Latitude: ${location.latitude}\n` +
		`Longitude: ${location.longitude}\n` +
		`Accuracy: ${location.accuracy || 'N/A'} meters\n` +
		times.get('nightEnd') ? `Night end: ${tzf(times.get('nightEnd')!)}\n` : '' +
		times.get('nauticalDawn') ? `Blue hour: ${tzf(times.get('nauticalDawn')!)}\n` : '' +
		times.get('dawn') ? `Dawn: ${tzf(times.get('dawn')!)}\n` : '' +
		times.get('sunrise') ? `Sunrise: ${tzf(times.get('sunrise')!)}-${tzf(times.get('sunriseEnd')!)}\n` : '' +
		times.get('goldenHourEnd') ? `Golden hour end: ${tzf(times.get('goldenHourEnd')!)}\n` : '' +
		times.get('goldenHour') ? `Golden hour: ${tzf(times.get('goldenHour')!)}\n` : '' +
		times.get('sunsetStart') ? `Sunset: ${tzf(times.get('sunsetStart')!)}-${tzf(times.get('sunset')!)}\n` : '' +
		times.get('dusk') ? `Dusk: ${tzf(times.get('dusk')!)}\n` : '' +
		times.get('nauticalDusk') ? `Blue hour: ${tzf(times.get('nauticalDusk')!)}\n` : '' +
		times.get('night') ? `Night: ${tzf(times.get('night')!)}\n` : '';

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
