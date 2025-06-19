import { getCurrentInstance } from 'vue';

/**
 * Composable for emitting map events with additional data.
 * @param {Object} map - The map instance to include in emitted events.
 */
export function useMapboxEmit(map) {
  const instance = getCurrentInstance();

  /**
   * Emit Vue event with additional data.
   * @param {string} name - Event name.
   * @param {Object} [data={}] - Additional data.
   */
  function emitEvent(name, data = {}) {
    if (instance && instance.emit) {
      instance.emit(name, {
        map,
        component: instance.proxy,
        ...data
      });
    }
  }

  /**
   * Emit Vue event with Mapbox event as additional data.
   * @param {Object} event - Mapbox event.
   * @param {Object} [data={}] - Additional data.
   */
  function emitMapEvent(event, data = {}) {
    emitEvent(event.type, { mapboxEvent: event, ...data });
  }

  return {
    emitEvent,
    emitMapEvent
  };
}