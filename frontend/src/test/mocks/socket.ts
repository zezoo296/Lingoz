import { vi } from "vitest";

type EventCallback = (...args: any[]) => void;

export class MockSocket {
    id = "mock-socket-id";
    connected = false;
    private listeners: Map<string, Set<EventCallback>> = new Map();

    on = vi.fn((event: string, callback: EventCallback) => {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
        return this;
    });

    off = vi.fn((event: string, callback?: EventCallback) => {
        if (!callback) {
            this.listeners.delete(event);
        } else {
            this.listeners.get(event)?.delete(callback);
        }
        return this;
    });

    emit = vi.fn((_event: string, ..._args: any[]) => {
        return this;
    });

    connect = vi.fn(() => {
        this.connected = true;
        return this;
    });

    disconnect = vi.fn(() => {
        this.connected = false;
        return this;
    });

    /** Test helper to simulate an incoming event from the server */
    __trigger(event: string, ...args: any[]) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => callback(...args));
        }
    }

    /** Reset state and mock histories */
    __reset() {
        this.listeners.clear();
        this.connected = false;
        this.on.mockClear();
        this.off.mockClear();
        this.emit.mockClear();
        this.connect.mockClear();
        this.disconnect.mockClear();
    }
}

export const mockSocket = new MockSocket();
