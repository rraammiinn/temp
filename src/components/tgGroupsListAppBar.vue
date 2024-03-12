<template>
    <v-btn style="margin-right: .5rem;" rounded @click="$router.back()" variant="text" icon="mdi-arrow-left"></v-btn>
    <Transition name="fade-and-move">
      <v-toolbar-title v-show="(!showSearch && !groupSearch)">groups</v-toolbar-title>
    </Transition>
    <v-spacer></v-spacer>
    <Transition name="scale">
      <v-text-field ref="input" v-show="(showSearch||groupSearch)" style="margin-right: 1rem;"
      dir="auto"
        :loading="loading"
        density="compact"
        variant="solo"
        label="search"
        append-inner-icon=""
        single-line
        hide-details
        @click:append-inner="onClick"
        v-model="groupSearch"
      ></v-text-field>
    </Transition>
    
    <v-btn rounded @click="showSearch = !showSearch;groupSearch='';$nextTick(()=>{input.focus()});" variant="text" :icon='(showSearch||groupSearch) ? "mdi-close" : "mdi-plus"'></v-btn>
</template>

<script setup>
import {ref, inject} from 'vue';
import { storeToRefs } from "pinia";
import { useOtherStore } from "@/store/otherStore";

const {showGroupSearch : showSearch}=storeToRefs(useOtherStore())
// const showSearch=ref(false)
const groupSearch=inject('groupSearch')
const input=ref()


</script>