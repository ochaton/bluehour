import { handleWebhook } from './telegram/utils/handleUpdates';
import { Env as TgEnv } from './telegram/env';
import { tg } from './telegram/lib/methods';

import { Router } from '@tsndr/cloudflare-worker-router'

// Env Types
export type Var<T = string> = T
export type Secret<T = string> = T

class Env implements TgEnv {
	// MY_KV_NAMESPACE: KVNamespace
	// MY_BUCKET: R2Bucket
	TELEGRAM_SECRET: Secret
	TELEGRAM_API_TOKEN: Secret

	constructor(secret: Secret, api_token: Secret) {
		this.TELEGRAM_SECRET = secret
		this.TELEGRAM_API_TOKEN = api_token;
	}
	getSecret(): string {
		return this.TELEGRAM_SECRET
	}
	getApiToken(): string {
		return this.TELEGRAM_API_TOKEN
	}
}

// Request Extension
export type ExtReq = {}
// Context Extension
export type ExtCtx = {}

// Define constant paths for webhook management.
const WEBHOOK: string = '/endpoint';
const REGISTER: string = '/registerWebhook';
const UNREGISTER: string = '/unRegisterWebhook';

// Initialize Router
const router = new Router<Env, ExtReq, ExtCtx>()
router.use(({ env, req }) => {
	const url: URL = new URL(req.url);
	switch (url.pathname) {
		case WEBHOOK:
			if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.getSecret()) {
				return new Response('Unauthorized\n', { status: 403 })
			}
			break;
		default:
			break;
	}
})

// telegram webhook
router.post(WEBHOOK, async ({ env, req }) => {
	return handleWebhook<ExtReq>(env, req)
})

router.post(REGISTER, async ({ ctx, env, req }) => {
	const url: URL = new URL(req.url);
	const port: string = url.port ? `:${url.port}` : '';
	const webhookUrl: string = `${url.protocol}//${url.hostname}${port}${WEBHOOK}`;
	return tg.setWebhook(env, {
		url: webhookUrl,
		secret_token: env.getSecret(),
	})
	.then(() => new Response('Webhook registered.'))
	.catch((error) => {
		ctx?.waitUntil(new Promise(resolve => {
			console.log(`Error: ${error}`);
			resolve(error);
		}))
		return new Response(`Error: ${error}`, { status: 500 });
	})
})

router.post(UNREGISTER, async ({ env }) => {
	return tg.setWebhook(env, {
		url: '',
	})
	.then(() => new Response('Webhook unregistered.'))
	.catch((error) => {
		return new Response(`Error: ${error}`, { status: 500 });
	})
})

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        return router.handle(request, new Env(env.TELEGRAM_SECRET, env.TELEGRAM_API_TOKEN), ctx)
    }
} satisfies ExportedHandler<Env>;
