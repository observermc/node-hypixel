import { Cache } from "./index.js"
import { default as RedisClient } from "ioredis"

export interface RedisCacheOptions {
    ttl: number
    keyPrefix: string
}

export class RedisCache implements Cache {
    static defaultOptions: RedisCacheOptions = {
        ttl: 60,
        keyPrefix: "ohc-e4370f16",
    }

    options: RedisCacheOptions

    client: RedisClient

    constructor(url: string, options?: Partial<RedisCacheOptions>)
    constructor(client: RedisClient, options?: Partial<RedisCacheOptions>)

    constructor(
        urlOrClient: string | RedisClient,
        options?: Partial<RedisCacheOptions>,
    ) {
        if (typeof urlOrClient === "string") {
            this.client = new RedisClient(urlOrClient)
        } else {
            this.client = urlOrClient
        }

        this.options = {
            ...RedisCache.defaultOptions,
            ...options,
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const rawValue = await this.client.get(
            `${this.options.keyPrefix}:${key}`,
        )

        if (rawValue === null) {
            return null
        }

        return JSON.parse(rawValue)
    }

    async set<T>(key: string, value: T): Promise<void> {
        await this.client.set(
            `${this.options.keyPrefix}:${key}`,
            JSON.stringify(value),
            "EX",
            this.options.ttl,
        )
    }
}
