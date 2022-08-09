import { Cache } from "./cache/index.js"

export interface ClientOptions {
    baseUrl: string
}

export class Client {
    static defaultOptions: ClientOptions = {
        baseUrl: "https://api.hypixel.net",
    }

    key: string
    cache: Cache | null
    options: ClientOptions

    constructor(
        key: string,
        cache?: Cache | null,
        options?: Partial<ClientOptions>,
    ) {
        this.key = key
        this.cache = cache ?? null

        this.options = {
            ...Client.defaultOptions,
            ...options,
        }
    }
}
