<script setup>
  import { computed, onMounted, onUnmounted, ref, inject, watch } from 'vue';
  import { MglGeojsonLayer, MglPopup } from 'vue-mapbox3';
  import FeatureModal from '@Modals/FeatureModal.vue';
  import utils from '@utils/utils.js';
  import DetailDrawer from '../Utility/DetailDrawer.vue';

  const props = defineProps({
    geojson: {
      type: Object,
      required: true,
      validator: (val) =>
        val && typeof val === 'object' &&
        val.type === 'geojson' &&
        val.data && typeof val.data === 'object' &&
        val.data.type === 'FeatureCollection' &&
        Array.isArray(val.data.features) &&
        val.data.features.length >= 0,
    },
    type: {
      type: String,
      required: true,
      validator: val => ['fill', 'line', 'circle', 'symbol'].includes(val)
    },
    paint: {
      type: Object,
      default: () => ({}),
      validator: val => typeof val === 'object' &&
        Object.keys(val).length > 0 &&
        Object.values(val).every(value => typeof value === 'string' ||
          Array.isArray(value) ||
          typeof value === 'number'||
          typeof value === 'boolean')
    },
    layout: {
      type: Object,
      default: () => ({}),
      validator: val => typeof val === 'object' &&
        Object.keys(val).length > 0 &&
        Object.values(val).every(value => typeof value === 'string' ||
          typeof value === 'boolean')
    },
    layerId: {
      type: String,
      default: () => `layer-${Math.random().toString(36).slice(2)}`
    },
    filterYear: {
      type: String,
      default: ''
    },
    map: {
      type: Object,
      required: true,
      validator: val => val && typeof val === 'object' && 'on' in val && 'off' in val
    },
    featureFormatter: {
      type: Function,
      default: (feature) => feature
    },
    searchTerm: {
      type: String,
      default: ''
    },
    before: {
      type: String,
      default: null
    },
    poiGeoJson: {
      type: Object,
      default: null
    }
  })

  const mapboxgl = inject('mapboxgl');

  defineExpose({
    fitMapToMarkers,
  });

  function fitMapToMarkers() {
    // const bounds = new mapboxgl.LngLatBounds();

    // // Get the features from the source
    // const features = props.map.querySourceFeatures(props.geojson.data.id, {
    //   sourceLayer: props.layerId // If using vector tiles, specify the source layer
    // });

    // // Extend the bounds for each feature
    // for (const feature of features) {
    //   if (feature.geometry.type === 'Point') {
    //     bounds.extend(feature.geometry.coordinates);
    //   }
    // }

    const bounds = [
      [-95.99293819642854, 36.15576946455974], // Southwest coordinates
      [-95.98273612672106, 36.16555066509859]  // Northeast coordinates
    ];

    // Fit the map to the calculated bounds
    props.map.fitBounds(bounds, {
      padding: 200
    });
  }

  const clickedfeature = ref({id:0, properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } });

  const detailRef = ref(null);
  const showDrawer = ref(false);


  // Conditionally apply filter based on string year
  const layerDefinition = computed(() => {
    const includeSearch = props.layerId.includes("search");
    const YearExemptLayers = ['1920-burned-area-layer', 'poi-layer', '1920-street-layer', '1920-building-layer', '1920-all-building-layer'];
    const hasYear = props.filterYear && utils.isYear(props.filterYear);
    const hasSearchTerm = !!props.searchTerm && includeSearch;

    const filterParts = ['all'];

    if (hasYear && !YearExemptLayers.includes(props.layerId)) {
      filterParts.push(['==', ['get', 'year'], props.filterYear === "" ? "" : Number.parseInt(props.filterYear).toString()]);
    }

    if (hasSearchTerm) {
      filterParts.push(['in', props.searchTerm.toLowerCase(), ['get', 'searchable_text']]);
    }

    const filter = filterParts;

    return {
      id: props.layerId,
      type: props.type,
      paint: props.paint,
      layout: props.layout,
      filter: filter,
    }
  })


// Popup state
const popupCoords = ref(null);
const popupProps = ref(null);


  function showDetails() {
    // modalRef.value?.openDialog();
    // modalHidden.value = false;
    showDrawer.value = true;
  }


  onMounted(() => {
    props.map.on('click', props.layerId, handleClick); // Attach click listener to the layer
  })

  onUnmounted(() => {
    props.map.off('click', props.layerId, handleClick); // Clean up click listener
  })

  function validateJsonData(json) {
    if (!json || !json.data || !json.data.features || !Array.isArray(json.data.features)) {
      console.warn('Invalid GeoJSON data, expected an object with a features array.');
      return { type:'geojson', data: { id: data.id, type: 'FeatureCollection', features: [] } };
    }
    if (!json.data.id || typeof json.data.id !== 'string') {
      console.error('GeoJSON data is missing a valid id');
      return;
    }
    return json;
  }

  function normalizeFeatureQuery(featureArray) {

    const propertyDefinitions = {
      "address": "Array",
      "PRIMARY": "String",
      "buildings": "Array",
      "OBJECTID": "Number",
      "STREET": "String"
    }

    featureArray.map(feature => {
      Object.keys(feature.properties).map (prop => {
        feature.properties[prop] = parseStringifiedValue(feature.properties[prop], propertyDefinitions[prop] || "String");
      });
    });

    return featureArray;
  }

  function parseStringifiedValue(str, type) {
    switch (type) {
      case "Array":
        try {
          // Handle case where it might already be an array
          if (Array.isArray(str)) return str;

          // Handle null/undefined
          if (!str) return [];

          // Parse the encoded JSON string
          return JSON.parse(str);
        } catch (error) {
          console.warn('Failed to parse stringified array:', str, error);
          return [];
        }
      case "Number":
        try {
          // Handle case where it might already be an number
          if (typeof(str) === 'number') return str;

          // Handle null/undefined
          if (!str) return null;

          // Parse the encoded JSON string
          return JSON.parse(str);
        } catch (error) {
          console.warn('Failed to parse stringified number:', str, error);
          return null;
        }
      case "String":
      default:
        return String(str);
    }
  }

  async function handleClick(e) {
    let matchingBuilding = null;

    if (!e || !e.features || e.features.length === 0) return;
    if (e.features.length > 1) {
      console.warn('Multiple features clicked, only the first will be processed.');
    }

    if (props.layerId === '1920-all-building-layer' || props.layerId === '1920-street-layer' || props.layerId === '1920-burned-area-layer') {
      return;
    }

    e.features = normalizeFeatureQuery(e.features);
    let features = e.features;
    if (!features[0].properties) {
      console.warn('Clicked feature has no properties, skipping.');
      return;
    }
    if (!props.featureFormatter || typeof props.featureFormatter !== 'function') {
      console.warn('featureFormatter is not a valid function, using default formatter.');
      props.featureFormatter = (feature) => feature;
    }

    // Handle 1920-building-layer clicks - look up building data
    if (props.layerId === '1920-building-layer' &&
        features[0].properties.buildings &&
        Array.isArray(features[0].properties.buildings) &&
        features[0].properties.buildings.length > 0 &&
        props.poiGeoJson) {

      const firstBuildingId = features[0].properties.buildings[0];

      matchingBuilding = props.poiGeoJson.data.features.find(building =>
        building.properties.location_id && building.properties.location_id.toString() === firstBuildingId.toString()
      );

      if (matchingBuilding) {
        // Spread matching building properties into features[0].properties
        features[0].properties = {
          ...features[0].properties,
          ...matchingBuilding,
          ...matchingBuilding.properties
        };
      }
    }

    delete features[0].properties.properties;

    const combinedFeature = features[0];

    clickedfeature.value = props.featureFormatter(combinedFeature);
    props.map.flyTo({
      center: clickedfeature.value.geometry?.coordinates[0][0] || clickedfeature.value.geometry?.coordinates[0] || clickedfeature.value.geometry.coordinates,
      zoom: 16,
      speed: 1.2,
      curve: 1.5,
      easing: (t) => t
    });
    console.log(clickedfeature)
    // var open = detailRef.value?.openDialog;
    var open = showDetails;

    // new MglPopup({
    //   closeButton: true,
    //   closeOnClick: false,
    //   coordinates: clickedfeature.value.geometry.coordinates,
    //   anchor: 'top',
    //   offset: [0, -20],

    // })
    await utils.delayedAction(open, 1300); // Open dialog with a delay
  }

  function openPopup()
  {
    popupCoords.value = clickedfeature.value.geometry.coordinates;
  }
</script>

<template>
  <MglGeojsonLayer
    :layerId="layerId"
    :source-id="geojson.data.id"
    :source="validateJsonData(geojson)"
    :reactive="true"
    :layer="layerDefinition"
    :before="before"
  />
   <!-- Popup for selected feature -->
  <!-- <MglPopup :coordinates="popupCoords" anchor="bottom" @close="popupCoords = null">
    <div @click="{ detailRef.value?.openDialog; }">
      <strong>{{ popupProps?.name || popupProps?.description }}</strong><br>
      <small>{{ popupProps?.type || 'Feature' }}</small>
    </div>
  </MglPopup> -->
  <!-- <slot name="modal" :feature="clickedfeature" />
  <slot /> -->
  <DetailDrawer
    v-if="clickedfeature"
    :item="clickedfeature"
    v-model="showDrawer"/>
<!-- :category="layerId.includes('building') ? 'buildings' : (layerId.includes('poi') ? 'buildings' : null)" -->
  <!-- <FeatureModal
    v-if="clickedfeature"
    :feature="clickedfeature"
    ref="detailRef"/> -->

</template>