import * as handlers from '../handlers';
import { RouterRequest } from '@tsndr/cloudflare-worker-router';
import { Env } from '../env';

export async function handleWebhook<T>(env: Env, request: RouterRequest<T>): Promise<Response> {
    if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.getSecret()) {
        return new Response('Unauthorized', { status: 403 });
    }

    const update: tgTypes.Update = await request.json();
    await onUpdate(env, update);

    return new Response(JSON.stringify(update, null, 2));
}

const updateHandlers: Map<keyof tgTypes.Update, (env: any, update: any) => Promise<void>> = new Map([
    ['message', (env, update) => handlers.handleMessage(env, update as tgTypes.Message)],
    ['edited_message', (env, update) => handlers.handleEditedMessage(env, update as tgTypes.Message)],
    ['channel_post', (env, update) => handlers.handleChannelPost(env, update as tgTypes.Message)],
    ['edited_channel_post', (env, update) => handlers.handleEditedChannelPost(env, update as tgTypes.Message)],
    ['business_connection', (env, update) => handlers.handleBusinessConnection(env, update as tgTypes.BusinessConnection)],
    ['business_message', (env, update) => handlers.handleBusinessMessage(env, update as tgTypes.Message)],
    ['edited_business_message', (env, update) => handlers.handleEditedBusinessMessage(env, update as tgTypes.Message)],
    ['deleted_business_messages', (env, update) => handlers.handleDeletedBusinessMessages(env, update as tgTypes.BusinessMessagesDeleted)],
    ['message_reaction', (env, update) => handlers.handleMessageReaction(env, update as tgTypes.MessageReactionUpdated)],
    ['message_reaction_count', (env, update) => handlers.handleMessageReactionCount(env, update as tgTypes.MessageReactionCountUpdated)],
    ['inline_query', (env, update) => handlers.handleInlineQuery(env, update as tgTypes.InlineQuery)],
    ['chosen_inline_result', (env, update) => handlers.handleChosenInlineResult(env, update as tgTypes.ChosenInlineResult)],
    ['callback_query', (env, update) => handlers.handleCallbackQuery(env, update as tgTypes.CallbackQuery)],
    ['shipping_query', (env, update) => handlers.handleShippingQuery(env, update as tgTypes.ShippingQuery)],
    ['pre_checkout_query', (env, update) => handlers.handlePreCheckoutQuery(env, update as tgTypes.PreCheckoutQuery)],
    ['poll', (env, update) => handlers.handlePoll(env, update as tgTypes.Poll)],
    ['poll_answer', (env, update) => handlers.handlePollAnswer(env, update as tgTypes.PollAnswer)],
    ['my_chat_member', (env, update) => handlers.handleMyChatMember(env, update as tgTypes.ChatMemberUpdated)],
    ['chat_member', (env, update) => handlers.handleChatMember(env, update as tgTypes.ChatMemberUpdated)],
    ['chat_join_request', (env, update) => handlers.handleChatJoinRequest(env, update as tgTypes.ChatJoinRequest)],
    ['chat_boost', (env, update) => handlers.handleChatBoost(env, update as tgTypes.ChatBoostUpdated)],
    ['removed_chat_boost', (env, update) => handlers.handleRemovedChatBoost(env, update as tgTypes.ChatBoostRemoved)],
]);

async function onUpdate(env: Env, update: tgTypes.Update) {
    try {
        for (const [key, handler] of updateHandlers) {
            if (update[key]) {
                await handler(env, update[key]);
                break;
            }
        }
    } catch (error) {
        console.error('Error handling update:', error);
    }
}
