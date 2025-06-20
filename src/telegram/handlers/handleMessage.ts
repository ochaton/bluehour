import { tg } from '../lib/methods';
import { Env } from '../env';

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

	await tg.sendMessage(env, {
		chat_id: message.chat.id,
		text: `Received your location: Latitude ${location.latitude}, Longitude ${location.longitude}, Accuracy ${location.accuracy || 'N/A'} meters.`,
	}).catch((error) => {
		console.log(`Error sending location message: ${error}`);
		return;
	})

	return;
}
