import { tg } from '../lib/methods';
import { Env } from '../env';

export async function handleMessage(env: Env, message: tgTypes.Message) {
	const messageText: string = message.text || '';

	// switch case to handle different commands
	switch (messageText) {
		case '/help':
			return handleHelpCommand(env, message);
		case '/change_location':
			return handleChangeLocationCommand(env, message);
		default:
			break;
	}

	tg.sendMessage(env, {
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
	tg.sendMessage(env, {
		chat_id: message.chat.id,
		text: helpMessage,
	}).catch((error) => {
		console.log(`Error sending help message: ${error}`)
		return
	});
}

async function handleChangeLocationCommand(env: Env, message: tgTypes.Message) {
	tg.sendMessage(env, {
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
