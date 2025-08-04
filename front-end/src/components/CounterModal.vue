<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <form @submit.prevent="save" class="bg-white p-4 rounded">
      <h2>{{ mode==='create' ? 'New Counter' : 'Edit Counter' }}</h2>
      <input v-model="f.name" placeholder="Name" required />
      <textarea v-model="f.description" placeholder="Description" />
      <div class="mt-2">
        <button type="submit">Save</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  props: ['mode', 'counter'],
  setup(props, { emit }) {
    const f = ref({ name: '', description: '' })
    watch(() => props.counter, c => {
      if (c) f.value = { name: c.name, description: c.description }
    })

    const save = async () => {
      const url = props.mode === 'create'
        ? '/api/counter'
        : `/api/counter/${props.counter.id}`
      const method = props.mode === 'create' ? 'POST' : 'PUT'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f.value)
      })
      emit('saved')
    }

    return { f, save }
  }
}
</script>