import { Env } from '../env';

export interface response {
    ok: boolean,
    result: any,
    description?: string
}

export function apiUrl(token: string, methodName: string, params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';

    return `https://api.telegram.org/bot${token}/${methodName}${query}`;
}

export async function callApi(env: Env, methodName: string, params?: Record<string, any>) {
    if (params) {
        params = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null));
    }
    const response: response = await (await fetch(apiUrl(env.getApiToken(), methodName, params))).json();
    if (!response.ok) {
        throw new Error('API Call Failed:\n' + JSON.stringify(response, null, 2));
    } else {
        return response.result;
    }
}
