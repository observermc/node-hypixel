import { Cache } from "./index.js"

export interface InMemoryCacheOptions {
    ttl: number
    size: number | null
}

interface InMemoryCacheItem<T> {
    value: T
    expiresAt: number
}

export class InMemoryCache implements Cache {
    static defaultOptions: InMemoryCacheOptions = {
        ttl: 60,
        size: null,
    }

    options: InMemoryCacheOptions

    items: Record<string, InMemoryCacheItem<any>> = {}

    cleanInterval: NodeJS.Timeout

    constructor(options?: Partial<InMemoryCacheOptions>) {
        this.options = {
            ...InMemoryCache.defaultOptions,
            ...options,
        }

        this.cleanInterval = setInterval(this.clean, 60e3)
    }

    async get<T>(key: string): Promise<T | null> {
        const item: InMemoryCacheItem<T> = this.items[key]

        if (item === undefined) {
            return null
        }

        if (item.expiresAt <= Date.now()) {
            delete this.items[key]
            return null
        }

        return item.value
    }

    async set<T>(key: string, value: T): Promise<void> {
        this.items[key] = {
            value,
            expiresAt: Date.now() + this.options.ttl * 1e3,
        }
    }

    private clean(): void {
        for (const key in this.items) {
            if (this.items[key].expiresAt <= Date.now()) {
                delete this.items[key]
            }
        }
    }
}
