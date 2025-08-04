<template>
  <div>
    <button @click="openModal('create')">+ Counter</button>
    <select v-model="sortKey">
      <option value="name">Name</option>
      <option value="event_count">Count</option>
      <option value="event_total">Total</option>
    </select>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Total</th>
          <th>Count</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in sorted" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.description }}</td>
          <td>{{ c.event_total }}</td>
          <td>{{ c.event_count }}</td>
          <td>
            <button @click="openModal('increment', c.id)">+/-</button>
            <button @click="openModal('edit', c)">✎</button>
          </td>
        </tr>
      </tbody>
    </table>

    <CounterModal v-if="modal==='create'||modal==='edit'" :mode="modal" :counter="current" @close="close"
      @saved="reload" />
    <IncrementForm v-if="modal==='increment'" :counterId="current" @close="close" @incremented="reload" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import CounterModal from './CounterModal.vue'
import IncrementForm from './IncrementForm.vue'

export default {
  components: { CounterModal, IncrementForm },
  setup() {
    const list = ref([])
    const sortKey = ref('name')
    const modal = ref(null)
    const current = ref(null)

    const fetchCounters = async () => {
      const res = await fetch('/api/counters')
      list.value = await res.json()
    }

    onMounted(fetchCounters)

    const sorted = computed(() =>
      [...list.value].sort((a, b) => (a[sortKey.value] > b[sortKey.value] ? 1 : -1))
    )

    const openModal = (mode, payload = null) => {
      modal.value = mode
      current.value = payload
    }
    const close = () => { modal.value = null; current.value = null }
    const reload = () => { close(); fetchCounters() }

    return { sorted, sortKey, modal, current, openModal, close, reload }
  }
}
</script>