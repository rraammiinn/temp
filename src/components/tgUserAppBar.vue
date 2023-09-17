<template>
    <v-btn @click="showUser=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
</template>

<script setup>
import {inject} from 'vue';
// const currentPage=inject('currentPage')
const showUser=inject('showUser')
// const previousPage=inject('previousPage')

</script>