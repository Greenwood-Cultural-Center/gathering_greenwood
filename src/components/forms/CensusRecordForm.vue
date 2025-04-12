<script setup>
const props = defineProps({ item: Object });
</script>

<template>
  <div>
    <h2>Census Record</h2>
    <p><strong>Head of Household:</strong> {{ item.head }}</p>
    <p><strong>Year:</strong> {{ item.year }}</p>
    <p><strong>Residents:</strong> {{ item.residents?.join(', ') }}</p>
  </div>
</template>