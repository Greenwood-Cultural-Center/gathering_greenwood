import { getCurrentInstance } from 'vue';

export function useWithSelfEvents(control, emitMapEvent) {
  const instance = getCurrentInstance();

  /**
   * Emit a self event, including control and extra data.
   */
  function emitSelfEvent(event, data = {}) {
    emitMapEvent(event, { control, ...data });
  }

  /**
   * Bind events for markers, popups, and controls.
   * @param {string[]} events - List of event names to bind.
   * @param {Object} emitter - The Mapbox emitter (marker, popup, etc).
   */
  function bindSelfEvents(events, emitter) {
    if (!instance) return;
    let listeners = Object.keys(instance.attrs).filter(attr =>
      attr.startsWith('on')
    );
    listeners = listeners.map(attr => attr.slice(2).toLowerCase());
    listeners.forEach(eventName => {
      if (events.includes(eventName)) {
        emitter.on(eventName, emitSelfEvent);
      }
    });
  }

  /**
   * Unbind events for markers, popups, and controls.
   * @param {string[]} events - List of event names to unbind.
   * @param {Object} emitter - The Mapbox emitter (marker, popup, etc).
   */
  function unbindSelfEvents(events, emitter) {
    if (!events.length || !emitter) return;
    events.forEach(eventName => {
      emitter.off(eventName, emitSelfEvent);
    });
  }

  return {
    emitSelfEvent,
    bindSelfEvents,
    unbindSelfEvents
  };
}