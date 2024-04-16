<template>
<v-app-bar-nav-icon style="margin-right: .5rem;" rounded variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
<Transition name="fade-and-move">
  <v-toolbar-title v-show="(!showSearch && !searchMessage)">Tgram</v-toolbar-title>
</Transition>

<v-spacer></v-spacer>
<Transition name="scale">
  <v-text-field ref="input" v-show="(showSearch||searchMessage)" style="margin-right: 1rem;"
  dir="auto"
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
</Transition>

<v-btn rounded @click="showSearch = !showSearch;searchMessage='';$nextTick(()=>{input.focus()});" variant="text" :icon='(showSearch||searchMessage) ? "mdi-close" : "mdi-magnify"'></v-btn>


</template>

<style scoped>

</style>

<script setup>
    import { ref, inject } from 'vue';
    import { storeToRefs } from "pinia";
    import { useOtherStore } from "@/store/otherStore";

    const {showMessageSearch : showSearch}=storeToRefs(useOtherStore())
    const {showProgressBar, hideProgressBar}=useOtherStore()

    const drawer=inject('drawer')
    // const showSearch=ref(false)
    const searchMessage=inject('searchMessage')
    const input=ref()


</script>