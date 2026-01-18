import { openDB, DBSchema } from 'idb';

// Define the DB Schema for Web
interface OfflineDB extends DBSchema {
    queue: {
        key: string;
        value: QueueItem;
        indexes: { 'timestamp': number };
    };
}

export interface QueueItem {
    id: string;
    operario_id: string;
    entidad: string;
    accion: 'create' | 'update' | 'delete';
    payload: any;
    timestamp: number;
    status: 'pending' | 'synced' | 'failed';
    // Backwards compatibility / debugging extra fields
    method?: string;
    url?: string;
}

export interface StorageAdapter {
    getItems(): Promise<QueueItem[]>;
    addItem(item: QueueItem): Promise<void>;
    removeItem(id: string): Promise<void>;
    clear(): Promise<void>;
}

const DB_NAME = 'CuoioCaneOffline';
const STORE_NAME = 'queue';
const TAURI_STORAGE_DIR = 'C:\\ProgramData\\Cuoiodesk\\LPM'; // Hardcoded as requested
const TAURI_FILE_NAME = 'offline_queue.json';

// --- Web Adapter (IndexedDB) ---
class WebAdapter implements StorageAdapter {
    private async getDB() {
        return openDB<OfflineDB>(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: false });
                    store.createIndex('timestamp', 'timestamp');
                }
            },
        });
    }

    async getItems(): Promise<QueueItem[]> {
        const db = await this.getDB();
        return db.getAll(STORE_NAME);
    }

    async addItem(item: QueueItem): Promise<void> {
        const db = await this.getDB();
        await db.put(STORE_NAME, item);
    }

    async removeItem(id: string): Promise<void> {
        const db = await this.getDB();
        await db.delete(STORE_NAME, id);
    }

    async clear(): Promise<void> {
        const db = await this.getDB();
        await db.clear(STORE_NAME);
    }
}

// --- Tauri Adapter (Filesystem) ---
class TauriAdapter implements StorageAdapter {
    private fs: any;

    constructor() {
        // Dynamically import Tauri modules to avoid SSR issues or Web crashes
        // We assume this class is only instantiated if Tauri is detected
    }

    private async init() {
        if (!this.fs) {
            // @ts-expect-error - Dynamic import for Tauri
            this.fs = await import('@tauri-apps/plugin-fs');
        }
    }

    private async ensureDir() {
        await this.init();
        try {
            // Check if dir exists, if not create.
            // plugin-fs doesn't have simple existsSync for arbitrary paths easily without scope permissions sometimes,
            // but we will try mkdir with recursive.
            // Note: In Tauri v2, we might need to rely on base directories. 
            // However, the prompt specifically asked for C:\ProgramData\Cuoiodesk\LPM
            // This requires absolute path capabilities which might need permissions in tauri.conf.json.
            // We will attempt to write.
            await this.fs.mkdir(TAURI_STORAGE_DIR, { recursive: true });
        } catch (e) {
            console.error('Error ensuring directory:', e);
        }
    }

    private async readQueueFile(): Promise<QueueItem[]> {
        await this.init();
        try {
            const filePath = `${TAURI_STORAGE_DIR}\\${TAURI_FILE_NAME}`;
            // check if file exists by trying to read
            const content = await this.fs.readTextFile(filePath);
            return JSON.parse(content);
        } catch (e) {
            // If file doesn't exist or error, return empty
            return [];
        }
    }

    private async writeQueueFile(items: QueueItem[]): Promise<void> {
        await this.ensureDir();
        const filePath = `${TAURI_STORAGE_DIR}\\${TAURI_FILE_NAME}`;
        await this.fs.writeTextFile(filePath, JSON.stringify(items, null, 2));
    }

    async getItems(): Promise<QueueItem[]> {
        return this.readQueueFile();
    }

    async addItem(item: QueueItem): Promise<void> {
        const items = await this.readQueueFile();
        // Remove existing if any (update)
        const filtered = items.filter(i => i.id !== item.id);
        filtered.push(item);
        await this.writeQueueFile(filtered);
    }

    async removeItem(id: string): Promise<void> {
        const items = await this.readQueueFile();
        const filtered = items.filter(i => i.id !== id);
        await this.writeQueueFile(filtered);
    }

    async clear(): Promise<void> {
        await this.writeQueueFile([]);
    }
}

// Factory
export function getStorageAdapter(): StorageAdapter {
    // Basic detection for Tauri
    // @ts-expect-error - Tauri internal check
    const isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;

    if (isTauri) {
        console.log('Offline Storage: Using Tauri Adapter');
        return new TauriAdapter();
    } else {
        console.log('Offline Storage: Using Web Adapter (IndexedDB)');
        return new WebAdapter();
    }
}
