<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <form @submit.prevent="apply" class="bg-white p-4 rounded">
      <h2>Increment</h2>
      <input type="number" v-model.number="val" required />
      <div class="mt-2">
        <button type="submit">OK</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  props: ['counterId'],
  setup(props, { emit }) {
    const val = ref(1)
    const apply = async () => {
      await fetch(`/api/counter/${props.counterId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: val.value })
      })
      emit('incremented')
    }
    return { val, apply }
  }
}
</script>