<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1>Counter Tracker</h1>
    <CounterList />
  </div>
</template>
<script>
import CounterList from './components/CounterList.vue'
export default { components: { CounterList } }
</script>