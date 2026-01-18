# Cuoio Cane Desktop - Architecture & Decisions

## Technology Stack

This desktop application is built using a modern, hybrid approach:

*   **Core Framework**: [Tauri v2](https://v2.tauri.app/) (Rust-based, highly secure, and lightweight).
*   **Frontend**: Next.js (react) located in `apps/admin`. It runs as the UI layer for the desktop app.
*   **Backend / System Layer**: Rust (managed by Tauri in `apps/desktop/src-tauri`).
*   **Language**: TypeScript for frontend logic, Rust for system interactions.
*   **Data Synchronization**: Custom Offline-First architecture using `IndexedDB` (Web) and `Tauri Filesystem` (Desktop).

## Key Implementations

### 1. Offline-First Storage Architecture (`storage.ts`)

To support offline functionality, we implemented an abstraction layer (`StorageAdapter`) in `apps/admin/src/lib/offline/storage.ts`.

*   **Web Mode**: Uses `idb` (IndexedDB) to store the action queue.
*   **Desktop Mode**: Uses `@tauri-apps/plugin-fs` to write the action queue to a JSON file on the local filesystem.

### 2. Filesystem Permissions & Storage Path

**Context**: Initially, we attempted to store data in `C:\ProgramData\Cuoiodesk\LPM`. This caused "forbidden path" errors because `ProgramData` usually requires administrative privileges, which the app does not (and should not) have by default.

**Resolution**: We switched to using the user's **AppData** directory. This is the standard "Best Practice" for storing user-specific application data on Windows (and maps correctly to `~/Library` on macOS strings).

**Technical Details**:
*   Instead of hardcoding paths, we use `BaseDirectory.AppData` from `@tauri-apps/plugin-fs`.
*   **Path**: `AppData/Cuoiodesk/LPM/offline_queue.json`.
*   **Code Example**:
    ```typescript
    const { BaseDirectory } = await import('@tauri-apps/plugin-fs');
    await this.fs.writeTextFile(filePath, content, { baseDir: BaseDirectory.AppData });
    ```

### 3. Tauri Capabilities & Security (`default.json`)

To enable the above functionality securely, we configured `apps/desktop/src-tauri/capabilities/default.json`:

*   **Permissions**:
    *   `fs:allow-read-text-file`
    *   `fs:allow-write-text-file`
    *   `fs:allow-mkdir`
    *   `fs:allow-exists`
*   **Scopes**: We explicitly whitelisted the `Cuoiodesk` directory in `AppData`:
    ```json
    "$APPDATA/Cuoiodesk",
    "$APPDATA/Cuoiodesk/*",
    "$APPDATA/Cuoiodesk/LPM/**"
    ```
    *Note: We avoided adding `path:default` or `tauri-plugin-path` as they introduced unnecessary dependency conflicts. The native `fs` plugin with `BaseDirectory` was sufficient.*

## Future Replication Guide

If you need to replicate or extend this functionality:
1.  **Do not hardcode absolute paths** (like `C:\...`). Always use `BaseDirectory` enums.
2.  **Verify Capabilities**: Ensure any new directory you want to write to is whitelisted in `capabilities/default.json`.
3.  **Keep Dependencies Minimal**: We successfully avoided adding extra plugins for path resolution by leveraging the features already built into `plugin-fs`.
