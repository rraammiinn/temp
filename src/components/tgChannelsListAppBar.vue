<template>
  <v-btn style="margin-right: .5rem;" rounded @click="$router.back()" variant="text" icon="mdi-arrow-left"></v-btn>
  <v-toolbar-title v-show="(!showSearch && !channelSearch)">channels</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-text-field v-show="(showSearch||channelSearch)" style="margin-right: 1rem;"
      :loading="loading"
      density="compact"
      variant="solo"
      label="search"
      append-inner-icon=""
      single-line
      hide-details
      @click:append-inner="onClick"
      v-model="channelSearch"
    ></v-text-field>
  <v-btn rounded @click="showSearch = !showSearch;channelSearch='';" variant="text" :icon='(showSearch||channelSearch) ? "mdi-close" : "mdi-plus"'></v-btn>
</template>

<script setup>
import {ref, inject} from 'vue';
const showSearch=ref(false)
const channelSearch=inject('channelSearch')

</script>