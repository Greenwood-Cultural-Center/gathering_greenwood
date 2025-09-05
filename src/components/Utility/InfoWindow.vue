<script setup>
import { ref, nextTick } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  item: { type: Object, required: true }
});

const showTooltip = ref(false);
const tooltipRef = ref(null);
const containerRef = ref(null);

const handleMouseOver = async () => {
  showTooltip.value = true;
  await nextTick();
  adjustTooltipPosition();
};

const handleMouseOut = () => {
  showTooltip.value = false;
};

const handleClick = async () => {
  showTooltip.value = !showTooltip.value;
  if (showTooltip.value) {
    await nextTick();
    adjustTooltipPosition();
  }
};

const adjustTooltipPosition = () => {
  if (!tooltipRef.value || !containerRef.value) return;

  const tooltip = tooltipRef.value;
  const container = containerRef.value;
  const rect = container.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const margin = 10; // Margin from viewport edge

  // Position tooltip using fixed positioning relative to the trigger icon
  const tooltipWidth = 350; // Match our CSS width
  const tooltipHeight = tooltip.offsetHeight || 200; // Estimated height

  // Calculate icon center position
  const iconCenterX = rect.left + rect.width / 2;
  const iconCenterY = rect.top + rect.height / 2;

  // Calculate optimal tooltip position
  let left = iconCenterX - tooltipWidth / 2;
  let top = rect.top - tooltipHeight - 10; // Position above the icon
  let isAbove = true;

  // Adjust horizontal position if it would overflow
  if (left < margin) {
    left = margin;
  } else if (left + tooltipWidth > viewportWidth - margin) {
    left = viewportWidth - tooltipWidth - margin;
  }

  // Adjust vertical position if it would overflow at the top
  if (top < margin) {
    top = rect.bottom + 10; // Position below the icon instead
    isAbove = false;
  }

  // Calculate arrow position relative to tooltip
  const arrowLeft = iconCenterX - left;

  // Apply fixed positioning
  tooltip.style.position = 'fixed';
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.transform = 'none';
  tooltip.style.right = 'auto';
  tooltip.style.bottom = 'auto';

  // Position the arrow
  const arrow = tooltip.querySelector('::after') || tooltip;
  tooltip.style.setProperty('--arrow-left', `${arrowLeft}px`);
  tooltip.style.setProperty('--arrow-above', isAbove ? '1' : '0');
};
</script>

<template>
  <div class="tooltip-container" ref="containerRef">
    <FontAwesomeIcon
      :icon="['far', 'circle-info']"
      class="tooltip-trigger"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
      @click="handleClick"
    />
    <Transition name="tooltip">
      <div v-show="showTooltip" class="tooltipText" ref="tooltipRef">
        <table>
          <caption>This result has a confidence score of {{ item.confidence_score }}. The below show the fields that matched the search query</caption>
          <thead>
            <tr>
              <th>Record Type</th>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in item.match_details" :key="detail.field + detail.value">
              <td>{{ detail.type }}</td>
              <td>{{ detail.field }}</td>
              <td>{{ detail.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-trigger {
  cursor: pointer;
  color: #007bff;
  transition: color 0.2s ease;
}

.tooltip-trigger:hover {
  color: #0056b3;
}

.tooltipText {
  position: fixed;
  background-color: #333;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  white-space: normal;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 21.875rem;
  max-width: calc(100vw - 2rem);
}

.tooltipText::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 8px 0 8px;
  border-color: #333 transparent transparent transparent;
  top: calc(var(--arrow-above, 1) * 100%);
  bottom: calc((1 - var(--arrow-above, 1)) * 100%);
  left: var(--arrow-left, 50%);
  transform: translateX(-50%) rotate(calc((1 - var(--arrow-above, 1)) * 180deg));
}

.tooltipText table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tooltipText caption {
  margin-bottom: 0.75rem;
  font-weight: 600;
  text-align: left;
  color: #fff;
  white-space: normal;
  line-height: 1.4;
}

.tooltipText th,
.tooltipText td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #555;
  vertical-align: top;
}

.tooltipText th {
  background-color: #444;
  font-weight: 600;
  white-space: nowrap;
  width: auto;
}

.tooltipText td {
  word-break: break-word;
}

.tooltipText tr:last-child td {
  border-bottom: none;
}

/* Transition animations */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.3s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .tooltipText {
    width: calc(100vw - 2rem);
    max-width: none;
  }

  .tooltipText::after {
    display: none;
  }
}
</style>