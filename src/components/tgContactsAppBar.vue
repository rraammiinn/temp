<template>
    <v-btn @click="$router.back()" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-toolbar-title v-show="(!showSearch && !userSearch)">contacts</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-text-field v-show="(showSearch||userSearch)" style="margin-right: 1rem;"
        :loading="loading"
        density="compact"
        variant="solo"
        label="search"
        append-inner-icon=""
        single-line
        hide-details
        @click:append-inner="onClick"
        v-model="userSearch"
      ></v-text-field>
    <v-btn @click="showSearch = !showSearch;userSearch='';" variant="text" :icon='(showSearch||userSearch) ? "mdi-close" : "mdi-plus"'></v-btn>
</template>

<script setup>
import {ref, inject} from 'vue';
const showSearch=ref(false)
const userSearch=inject('userSearch')

</script>