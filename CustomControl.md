# CustomControl Interface Documentation

## Overview

**CustomControl** provides a flexible, abstract foundation for building custom Mapbox GL JS controls in Vue 3 projects.
It is **not meant to be used as-is**—instead, it is designed to be extended or customized for your specific use case.
This interface abstracts away the boilerplate and lifecycle management, allowing you to focus on your control’s unique UI and logic.

---

## ⚠️ Important

> **This component and JS factory are intended as templates or base classes.
> You should extend, overload, or compose them to implement your own control's UI and behavior.
> Do not use them directly in production without customization.**

---

## Vue Component: `<CustomControl />`

### **Props**

| Prop                | Type      | Default                    | Description                                                                                   |
|---------------------|-----------|----------------------------|-----------------------------------------------------------------------------------------------|
| `position`          | String    | `'bottom-right'`           | Mapbox control position (`'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'`).     |
| `prepend`           | Boolean   | `false`                    | If `true`, prepends the control to the specified parent container.                            |
| `customControlType` | String    | `'contrast'`               | Label/type for the control (for identification or display).                                   |
| `prependParentId`   | String    | `null`                     | DOM id of the parent to prepend the control to (required if `prepend` is `true`).             |
| `container`         | Object    | `null`                     | Provide a custom container element for the control.                                           |
| `group`             | Boolean   | `false`                    | If `true`, adds the `mapboxgl-ctrl-group` class for grouped controls.                         |
| `classList`         | Array     | `['mapboxgl-ctrl-custom']` | Additional CSS classes for the control container.                                             |

### **Slots**

- **default**: Content to render inside the control if no custom container is provided.

### **Usage Example**

```vue
<CustomControl
  position="top-left"
  :prepend="true"
  prependParentId="my-custom-controls"
  :classList="['my-special-control']"
>
  <button @click="doSomething">My Custom Button</button>
</CustomControl>
```

---

## JS Factory/Class: `createCustomControl(options)` / `ContrastControl`

### **Options**

| Option       | Type      | Default                    | Description                                                                                   |
|--------------|-----------|----------------------------|-----------------------------------------------------------------------------------------------|
| `position`   | String    | `'top-right'`              | Mapbox control position.                                                                      |
| `prepend`    | Boolean   | `false`                    | If `true`, prepends the control to the specified parent container.                            |
| `parentId`   | String    | `null`                     | DOM id of the parent to prepend the control to (required if `prepend` is `true`).             |
| `container`  | Object    | `null`                     | Custom container element for the control.                                                     |
| `group`      | Boolean   | `false`                    | Adds the `mapboxgl-ctrl-group` class if `true`.                                               |
| `classList`  | Array     | `['mapboxgl-ctrl-custom']` | Additional CSS classes for the control container.                                             |
| `label`      | String    | `'Contrast'`               | Label or identifier for the control.                                                          |

### **Usage Example**

```js
import { createCustomControl } from './models/CustomControl.js';

const myControl = createCustomControl({
  position: 'bottom-left',
  prepend: true,
  parentId: 'my-controls',
  classList: ['my-custom-class'],
  label: 'MyControl'
});

map.addControl(myControl, 'bottom-left');
```

---

## Customization Guidance

- **Extend or compose**: Use this as a base and add your own UI, event handlers, and logic.
- **Slots or container**: Provide your own slot content (in Vue) or custom container (in JS) for full control over the rendered output.
- **Lifecycle**: The component/factory manages adding and removing the control from the map for you.

---

## ⚠️ Not for Direct Use

This interface is a **template/abstract base**.
You must customize it for your project's needs—add your own buttons, icons, event handlers, and logic.

---

## Example: Extending for a Custom Button

```vue
<script setup>
import CustomControl from './CustomControl.vue';

function onContrastClick() {
  // Custom logic here
}
</script>

<template>
  <CustomControl>
    <button @click="onContrastClick">Contrast</button>
  </CustomControl>
</template>
```

---

**For more advanced usage, extend the JS class or factory and override the `onAdd`/`onRemove` methods as needed.**

---
