export class AbortManager {
  private controller: AbortController | null = null;
  register<T>(cb: (s: AbortSignal) => Promise<T>): Promise<T> {
    if (this.controller !== null) {
      this.controller.abort();
    }
    this.controller = new AbortController();
    return cb(this.controller.signal);
  }
}

export interface PersistenceStrategy {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => void;
  removeItem: (key: string) => void;
}

export class VolatileStorage {
  private storage;
  constructor() {
    this.storage = new Map();
  }
  getItem(key: string) {
    this.storage.get(key);
  }
  setItem(key: string, value: string) {
    this.storage.set(key, value);
  }
}

export class CacheManager {
  private persistenceStrategy;
  private storagePrefix = "rqmgmt:";
  constructor(
    persistanceStrategy: PersistenceStrategy = window.localStorage,
    storagePrefix: string
  ) {
    this.persistenceStrategy = persistanceStrategy;
    this.storagePrefix = storagePrefix;
  }
  set(
    key: string,
    value: string,
    ttl: number = 1000 * 60 * 5,
    invalidates: string
  ) {}
  delete(key: string) {
    this.persistenceStrategy.removeItem(`${this.storagePrefix}${key}`);
  }
  get(key: string) {
    this.persistenceStrategy.getItem(`${this.storagePrefix}${key}`);
  }
}
