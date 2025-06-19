import { onBeforeUnmount, inject } from 'vue';
import { useWithEvents } from '@/composables/useWithEvents';
import { useWithSelfEvents } from '@/composables/useWithSelfEvents';

/**
 * Composable to register a Mapbox control with lifecycle management.
 * @param {Object} control - The Mapbox control instance.
 * @param {Object} options - Options object.
 * @param {String} [options.position='top-right'] - Control position.
 * @param {Function} emitEvent - Function to emit events (from useMapboxEmit).
 */
export function useCustomControl(control, { position = 'top-right' } = {}, emitEvent) {
  // Inject mapbox and map from parent (provide/inject)
  const mapbox = inject('mapbox');
  const map = inject('map');

  // Compose event handling
  useWithEvents(/* pass needed args */);
  useWithSelfEvents(/* pass needed args */);

  // Add control to map
  function addControl() {
    try {
      map.addControl(control, position);
    } catch (err) {
      emitEvent && emitEvent('error', { error: err });
      return;
    }
    emitEvent && emitEvent('added', { control });
  }

  // Remove control from map on unmount
  onBeforeUnmount(() => {
    if (map && control) {
      map.removeControl(control);
    }
  });

  return {
    map,
    mapbox,
    addControl
  };
}