<template>

<div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4rem;">
    <div class="main">
        <img style="width: 100%;" :src="`/api/files/users/${props.otherId.id}/${props.otherId.avatar}`" alt="">
        <div style="width: 100%;margin-bottom: 1rem;">
            <v-btn @click="showUser=false;" icon="mdi-message" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
        </div>
        <v-col style="padding: 1rem;">
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.otherId.name}}</h3><h5 style="opacity: .5;">name</h5>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.otherId.username}}</h3><h5 style="opacity: .5;">username</h5>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.otherId.bio}}</h3><h5 style="opacity: .5;">bio</h5>
            </div>
        </v-col>
    </div>
</div>

</template>

<style scoped>
.main{
    max-width: 50rem;
    margin: auto;
}
</style>

<script setup>
import { inject, ref } from 'vue';

const props=defineProps(['otherId'])
const showUser=inject('showUser')


</script>