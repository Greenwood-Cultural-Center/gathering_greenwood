# DetailDrawer Component

The `DetailDrawer` component is a dynamic, reusable drawer component that automatically detects the type of data being passed to it and renders the appropriate form component based on the data structure.

## Features

- **Automatic Type Detection**: Analyzes the item data structure to determine the appropriate form component
- **Multiple JSON Format Support**: Handles various data formats including GeoJSON, city directory records, census data, POI data, and more
- **Fallback Category Override**: Allows manual category specification when auto-detection isn't sufficient
- **Enhanced Data Processing**: Preprocesses data to ensure optimal form rendering
- **Comprehensive Error Handling**: Provides helpful debugging information when data types can't be determined

## Usage

### Basic Usage (Auto-Detection)

```vue
<template>
  <DetailDrawer
    v-model="showDrawer"
    :item="selectedItem"
  />
</template>

<script setup>
import { ref } from 'vue';
import DetailDrawer from '@Utility/DetailDrawer.vue';

const showDrawer = ref(false);
const selectedItem = ref({
  // Any supported data format
});
</script>
```

### Usage with Manual Category Override

```vue
<template>
  <DetailDrawer
    v-model="showDrawer"
    :item="selectedItem"
    category="buildings"
  />
</template>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modelValue` | `Boolean` | No | `false` | Controls drawer visibility (v-model) |
| `item` | `Object` | Yes | - | The data item to display in the drawer |
| `category` | `String` | No | `null` | Manual category override (skips auto-detection) |
| `dialogId` | `String` | No | `'result-modal'` | Unique identifier for the drawer instance |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Boolean` | Emitted when drawer visibility changes |
| `close` | - | Emitted when drawer is closed |

## Supported Data Formats

### 1. GeoJSON Features (Buildings/POIs)

#### Complex POI Data

```javascript
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-95.9865047, 36.1619158]
  },
  properties: {
    location_id: 727,
    title: "Vernon AME Church",
    addresses: [{ /* address objects */ }],
    people: [{ /* person objects */ }],
    stories: [{ /* story objects */ }],
    photos: [{ /* photo objects */ }]
  }
}
```

#### Simple Building Footprints

```javascript
{
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [[[/* coordinates */]]]
  },
  properties: {
    RecNum: 1
  }
}
```

### 2. City Directory Records (1921 Tulsa)

```javascript
{
  "no.": 1,
  "name": "Victor Pardillo",
  "address": "800 ADMIRAL BOULEVARD",
  "profession and establishment type": "Shop Owner"
}
```

### 3. Census Records

```javascript
{
  id: 8196,
  first_name: "William",
  last_name: "Cherry",
  middle_name: "M",
  sex: "Male",
  race: "Black",
  birth_year: 1870,
  pob: "Texas"
}
```

### 4. Story/Narrative Records

```javascript
{
  record: {
    id: 6,
    searchable_text: "Historical narrative"
  },
  sources: {
    body: "<div>The Oklahoma Eagle</div>"
  },
  story: {
    body: "<div>Story content...</div>"
  }
}
```

### 5. Media Records

```javascript
{
  type: "photo", // or "video", "audio"
  id: 1,
  title: "Historic Greenwood",
  url: "/photos/greenwood-1920.jpg"
}
```

### 6. Document Records

```javascript
{
  content_type: "application/pdf", // or image types
  title: "Document Title",
  url: "/documents/file.pdf"
}
```

## Type Detection Logic

The component uses the following detection hierarchy:

1. **Explicit Type Field**: Checks for `item.type` property
2. **GeoJSON Detection**: Identifies Features with geometry types
3. **Content Type**: Uses `content_type` for documents
4. **Field-Based Detection**: Analyzes field combinations:
   - City Directory: `name`, `address`, `profession and establishment type`
   - Census: `first_name`, `last_name`, `birth_year`, `race`, `sex`
   - Person: `first_name`, `last_name`, `searchable_name`
   - Story: `story`, `sources`, `record.searchable_text`
   - Building: `title`, `location_id`, `addresses`, `properties.title`

## Form Component Mapping

| Category | Component | Description |
|----------|-----------|-------------|
| `buildings` | `BuildingForm` | Building and POI data |
| `people` | `PersonForm` | Person and city directory records |
| `census_records` | `CensusRecordForm` | Census and demographic data |
| `stories` | `StoryForm` | Narratives and historical accounts |
| `documents` | `DocumentForm`, `PDFForm` | Document files |
| `media` | `PhotoMediaForm`, `VideoMediaForm`, `AudioMediaForm` | Media files |

## Data Processing

The component automatically processes data to optimize form rendering:

### GeoJSON Processing

- Extracts properties from GeoJSON features
- Flattens nested POI data structures
- Preserves geometry information for mapping

### POI Data Flattening

- Promotes nested arrays (people, stories, photos) to top level
- Maintains original structure while providing easy access

## Error Handling

When the component cannot determine the data type, it displays a helpful error message with:

- Detected category information
- Raw data inspection
- Debugging details

## Example Implementation

See `DetailDrawerExample.vue` for a complete working example with various data formats.

## Dependencies

- Vue 3 Composition API
- `Drawer.vue` component
- Form components (`BuildingForm`, `PersonForm`, etc.)
- `@/styles/scrollbar.module.css`

## Notes

- The component is designed to be backward compatible with existing implementations
- Auto-detection can be overridden with the `category` prop when needed
- All form components receive the processed item data as the `item` prop
- The drawer automatically handles responsive sizing and positioning
