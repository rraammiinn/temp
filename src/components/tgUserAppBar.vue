<template>
    <v-btn style="margin-right: .5rem;" rounded @click="showUser=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-spacer></v-spacer>
    <v-btn rounded variant="text" icon="mdi-dots-vertical"></v-btn>
</template>

<script setup>
import {inject} from 'vue';
const showUser=inject('showUser')

</script>