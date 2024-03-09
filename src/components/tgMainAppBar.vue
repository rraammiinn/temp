<template>
<v-app-bar-nav-icon style="margin-right: .5rem;" rounded variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

<v-toolbar-title v-show="(!showSearch && !searchMessage)">tgram</v-toolbar-title>

<v-spacer></v-spacer>

<v-text-field ref="input" v-show="(showSearch||searchMessage)" style="margin-right: 1rem;"
        :loading="loading"
        density="compact"
        variant="solo"
        label="search"
        append-inner-icon=""
        single-line
        hide-details
        @click:append-inner="onClick"
        v-model="searchMessage"
      ></v-text-field>
<v-btn rounded @click="showSearch = !showSearch;searchMessage='';$nextTick(()=>{input.focus()});" variant="text" :icon='(showSearch||searchMessage) ? "mdi-close" : "mdi-magnify"'></v-btn>


</template>

<script setup>
    import { ref, inject } from 'vue';
    import { storeToRefs } from "pinia";
    import { useOtherStore } from "@/store/otherStore";

    const {showMessageSearch : showSearch}=storeToRefs(useOtherStore())

    const drawer=inject('drawer')
    // const showSearch=ref(false)
    const searchMessage=inject('searchMessage')
    const input=ref()


</script>