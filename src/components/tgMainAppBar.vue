<template>
<v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

<v-toolbar-title v-show="!showSearch">tgram</v-toolbar-title>

<v-spacer></v-spacer>

<v-text-field v-show="(showSearch||chatSearch)" style="margin-right: 1rem;"
        :loading="loading"
        density="compact"
        variant="solo"
        label="search"
        append-inner-icon=""
        single-line
        hide-details
        @click:append-inner="onClick"
        v-model="chatSearch"
      ></v-text-field>
<v-btn @click="showSearch = !showSearch;chatSearch='';" variant="text" :icon='(showSearch||chatSearch) ? "mdi-close" : "mdi-magnify"'></v-btn>


</template>

<script setup>
    import { ref, inject } from 'vue';

    const drawer=inject('drawer')
    const showSearch=ref(false)
    const chatSearch=inject('chatSearch')
</script>