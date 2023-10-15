<template>
    <v-chip @click.stop="()=>{}" style="margin: .5rem;width: fit-content;" color="primary">
    <template #prepend>
        <a style="text-decoration: none;" :download="props.fileName.slice(0,props.fileName.lastIndexOf('.')-11)+props.fileName.slice(props.fileName.lastIndexOf('.'))" :href="props.link">
        <v-icon icon="mdi-file"></v-icon>
        </a>
        </template>
        <template #append>
            <v-icon @click.self="()=>{showName = !showName}" :icon="showName ? 'mdi-chevron-left' : 'mdi-chevron-right'"></v-icon>
            </template>
            {{ lable }}
            </v-chip>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";

const showName=ref(false)
const props=defineProps(['fileName','link'])

const lable=computed(()=>(showName.value ? props.fileName.slice(0,props.fileName.lastIndexOf('.')-11)+props.fileName.slice(props.fileName.lastIndexOf('.')) : null))
</script>