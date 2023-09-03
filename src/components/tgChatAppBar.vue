<template>
    <v-btn @click="if(previousPage==currentPage)currentPage='main'; else currentPage=previousPage;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-avatar @click="showUser=true;previousPage='chat';" :image="`/api/files/users/${other.id}/${other.avatar}`"></v-avatar>
    <!-- <v-list-item class="listItem" active-color="var(--tgBg)" @click="showUser=true;" :prepend-avatar="`/api/files/users/${other.id}/${other.avatar}`" :title="other.name" :subtitle="other.username"></v-list-item> -->
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
</template>

<style scoped>
.listItem{
    background-color: var(--tgBg);
}
.listItem:hover{
    background-color: var(--tgBg);
}
</style>

<script setup>
import {inject} from 'vue';
const currentPage=inject('currentPage')
const other=inject('other')
const showUser=inject('showUser')
const previousPage=inject('previousPage')



</script>