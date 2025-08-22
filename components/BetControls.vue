<!-- components/BetControls.vue -->
<template>
  <div class="flex justify-center space-x-2">
    <button 
      v-for="control in controls"
      :key="control.label"
      @click="control.action"
      :class="`px-3 py-1 rounded text-sm font-semibold transition-colors ${control.variant}`"
    >
      {{ control.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const { balance } = useBalance()

const controls = computed(() => [
  {
    label: 'Clear',
    action: () => emit('update:modelValue', 0),
    variant: 'bg-gray-600 hover:bg-gray-700'
  },
  {
    label: '+1',
    action: () => emit('update:modelValue', props.modelValue + 1),
    variant: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    label: '+10',
    action: () => emit('update:modelValue', props.modelValue + 10),
    variant: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    label: '+100',
    action: () => emit('update:modelValue', props.modelValue + 100),
    variant: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    label: '1/2',
    action: () => emit('update:modelValue', props.modelValue / 2),
    variant: 'bg-yellow-600 hover:bg-yellow-700'
  },
  {
    label: '×2',
    action: () => emit('update:modelValue', props.modelValue * 2),
    variant: 'bg-green-600 hover:bg-green-700'
  },
  {
    label: 'Max',
    action: () => emit('update:modelValue', balance.value),
    variant: 'bg-purple-600 hover:bg-purple-700'
  }
])
</script>
