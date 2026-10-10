<script setup lang="ts">
import type { Difficulty } from "../types";

defineProps<{ modelValue: Difficulty; disabled?: boolean }>();
defineEmits<{ "update:modelValue": [value: Difficulty] }>();

const options: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "normal", label: "Normal" },
  { value: "hard", label: "Hard" },
];
</script>

<template>
  <div class="difficulty" role="group" aria-label="Difficulty">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="chip"
      :aria-pressed="modelValue === o.value"
      :disabled="disabled"
      @click="$emit('update:modelValue', o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>
