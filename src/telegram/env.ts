export interface Env {
	getSecret(): string;
	getApiToken(): string;
	getKv(): KVNamespace;
};

