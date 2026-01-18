import { getStorageAdapter, QueueItem, StorageAdapter } from './storage';

class QueueManager {
    private storage: StorageAdapter;
    private memoryQueue: QueueItem[] = [];
    private initialized = false;

    constructor() {
        this.storage = getStorageAdapter();
    }

    async init() {
        if (this.initialized) return;
        try {
            this.memoryQueue = await this.storage.getItems();
            // Sort by unique timestamp to ensure FIFO
            this.memoryQueue.sort((a, b) => a.timestamp - b.timestamp);
            this.initialized = true;
            console.log(`[Queue] Initialized with ${this.memoryQueue.length} items.`);
        } catch (e) {
            console.error('[Queue] Failed to initialize:', e);
            // Fallback to empty
            this.memoryQueue = [];
            this.initialized = true;
        }
    }

    async enqueue(request: Omit<QueueItem, 'id' | 'timestamp' | 'status'>): Promise<string> {
        await this.init();

        const item: QueueItem = {
            ...request,
            id: generateUUID(),
            timestamp: Date.now(),
            status: 'pending'
        };

        this.memoryQueue.push(item);
        await this.storage.addItem(item);
        console.log(`[Queue] Enqueued item ${item.id} (${item.entidad} - ${item.accion})`);
        return item.id;
    }

    async dequeue(): Promise<QueueItem | undefined> {
        await this.init();
        if (this.memoryQueue.length === 0) return undefined;

        const item = this.memoryQueue.shift();
        if (item) {
            await this.storage.removeItem(item.id);
        }
        return item;
    }

    async peek(): Promise<QueueItem | undefined> {
        await this.init();
        return this.memoryQueue[0];
    }

    async remove(id: string): Promise<void> {
        await this.init();
        this.memoryQueue = this.memoryQueue.filter(i => i.id !== id);
        await this.storage.removeItem(id);
    }

    async getAll(): Promise<QueueItem[]> {
        await this.init();
        return [...this.memoryQueue];
    }

    async size(): Promise<number> {
        await this.init();
        return this.memoryQueue.length;
    }

    async clear(): Promise<void> {
        this.memoryQueue = [];
        await this.storage.clear();
    }
}

function generateUUID() {
    // Public Domain/MIT UUID generator
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const queueManager = new QueueManager();
