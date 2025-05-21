// event-emitter.ts
export type Listener<T> = (payload: T) => void;

export class EventEmitter<T = any> {
  private listeners = new Set<Listener<T>>();

  on(listener: Listener<T>): void {
    this.listeners.add(listener);
  }

  off(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }

  emit(payload: T): void {
    for (const listener of this.listeners) {
      listener(payload);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}