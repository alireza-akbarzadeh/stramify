<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const counter = ref(0)

const increment = () => {
  counter.value++
}

const state = reactive({
  count: 3
})

const doubleCounter = computed(() => counter.value * 2)
</script>

<template>
  <div>
    <Button @click="increment"> Click </Button>

    <p>Counter: {{ counter }}</p>

    <p>Reactive Count: {{ state.count }}</p>

    <p>Double: {{ doubleCounter }}</p>
  </div>
</template>
