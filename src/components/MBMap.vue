<script setup>
    import { ref, onMounted, watch, nextTick } from 'vue'
    import { filterByDate } from '@openhistoricalmap/maplibre-gl-dates'
    import { MapboxMap, MapboxFullscreenControl, MapboxNavigationControl } from '@studiometa/vue-mapbox-gl';
    import maplibregl from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css'


    const el = ref();
    const style = ref('https://www.openhistoricalmap.org/map-styles/main/main.json');
    const center = ref([-95.9872222, 36.1619444]); // starting position [lng, lat]
    const zoom = ref(15); // starting zoom level`
    const accessToken = ref('pk.eyJ1IjoidHVsc2FtYXBwaW5nIiwiYSI6ImNtNm4yeGk2dDBybmcyc3B5Y2kwZmZ1YXoifQ.2rjdphm0vkZ_4FBht5c7AA');
    const mapOptions = {
    };

    // Props (JS version)
    const props = defineProps({
    year: String,
    required: true
    });

    // Date selection logic
    const DateOption = {
    options: [
        { year: '1910', date: '1910-04-15' },
        { year: '1920', date: '1920-01-02' },
        { year: 'Both', date: '2025-01-01' }
    ],
    selected: ref({ year: 'Both', date: '2025-01-01' })
    };

    function changeYear (map, newYear) {
        const match = DateOption.options.find(o => o.year === newYear);
        if (match) {
            DateOption.selected.value = match;
            filterByDate(map, match.date);
        }
    };

    // Update selected date when `year` prop changes
    watch(
    () => props.year,
    (newYear) => {
        const map = el.value?.map;
        if (map) {
            changeYear(map, newYear);
        }
    },
    { immediate: true }
    );

    onMounted(() => {
        nextTick(() => {
            const map = el.value?.map;

            if (map) {
                map.on('load', () => {
                    changeYear(map, props.year);
                    map.once('styledata', () => {
                        map.attributionControl = {
                            customAttribution: '<a href="https://www.openhistoricalmap.org/">OpenHistoricalMap</a>',
                        };
                    });
                });
            }
        });
    });

</script>

<template>
    <MapboxMap
    :accessToken="accessToken"
    :min-zoom="1"
    :max-zoom="19"
    :attribution-control="false"
    :mapStyle="style"
    :center="center"
    :zoom="zoom"
    class="historical-map-container"
    ref="el"
    >
        <MapboxNavigationControl
            position="top-right"
            :showCompass="true"
            :showZoom="true"
            :showScale="false"
        />
        <MapboxFullscreenControl
            position="top-right"
        />
        <slot></slot>
    </MapboxMap>
</template>

<style scoped>
</style>