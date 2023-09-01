<template>
    <v-btn @click="currentPage='main'" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-list-item :prepend-avatar="`/api/files/users/${other.id}/${other.avatar}`" :title="other.name" :subtitle="other.username"></v-list-item>
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
</template>

<script setup>
import {inject} from 'vue';
const currentPage=inject('currentPage')
const other=inject('other')

</script>