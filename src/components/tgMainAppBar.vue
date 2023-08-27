<template>
<v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

<v-toolbar-title v-show="!showSearch">tgram</v-toolbar-title>

<v-spacer></v-spacer>

<v-text-field v-show="showSearch" style="margin-right: 1rem;"
        :loading="loading"
        density="compact"
        variant="solo"
        label="search"
        append-inner-icon=""
        single-line
        hide-details
        @click:append-inner="onClick"
      ></v-text-field>
<v-btn @click="showSearch = !showSearch" variant="text" :icon='showSearch ? "mdi-close" : "mdi-magnify"'></v-btn>


</template>

<script setup>
    import { ref, inject } from 'vue';

    const drawer=inject('drawer')
    const showSearch=ref(false)
</script>