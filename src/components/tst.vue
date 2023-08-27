<template>
  <v-infinite-scroll
    height="100vh"
    side="both"
    @load="load"
  >
    <template v-for="(item, index) in items" :key="item">
      <div :class="['px-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
        Item number {{ item }}
      </div>
    </template>
  </v-infinite-scroll>
</template>


<script setup>
import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll'
import { ref } from 'vue'


    const items = ref(Array.from({ length: 50 }, (k, v) => v + 1))



    function load ({ side, done }) {

          if (side === 'start') {
            const arr = Array.from({ length: 10 }, (k, v) => items.value[0] - (10 - v))
            items.value = [...arr, ...items.value]
          } else if (side === 'end') {
            const arr = Array.from({ length: 10 }, (k, v) => items.value.at(-1) + 1 + v)
            items.value = [...items.value, ...arr]
          }

          done('ok')
      }
</script>