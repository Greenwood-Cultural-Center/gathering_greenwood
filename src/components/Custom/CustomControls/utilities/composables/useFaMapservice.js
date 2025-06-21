// composables/useFaMapService.js
import { findIconDefinition, library, parse } from '@fortawesome/fontawesome-svg-core';


export function useFaMapService() {
  const fontAwesomeCharacterCode = (iconName) => {
    try {
      const parseIcon = parse.icon(iconName);
      const icon = findIconDefinition(parseIcon);
      return String.fromCharCode(parseInt(icon.icon[3], 16));
    } catch (error) {
      console.error('Error getting FontAwesome character code:', error);
      return '';
    }
  };

  return {
    fontAwesomeCharacterCode
  };
}