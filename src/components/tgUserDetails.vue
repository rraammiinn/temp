<template>

<div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4.1rem;">
    <div class="main">
        <img style="width: 100%;" :src="getUserAvatarUrl(props.user.id, props.user.avatar)" alt="">
        <div style="width: 100%;margin-bottom: 1rem;">
            <v-btn @click="showUser=false;if($route.name=='group')$router.push({name:'chat',params:{otherId:props.user.id},query:{showUser:false}})" icon="mdi-message" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
        </div>
        <v-col style="padding: 1rem;">
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.user.name}}</h3><h5 style="opacity: .5;">name</h5>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.user.username}}</h3><h5 style="opacity: .5;">username</h5>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.user.bio}}</h3><h5 style="opacity: .5;">bio</h5>
            </div>
        </v-col>
    </div>

    <div style="height: 3.25rem;"></div>

<v-btn @click="block(props.user.id)" v-if="props.isInRel && !props.blocked" style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="error">block</v-btn>
<v-btn @click="unblock(props.user.id)" v-if="props.isInRel && props.blocked" style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="primary">unblock</v-btn>

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
import { block,unblock } from '@/funcs/chatFuncs';

import {getUserAvatarUrl} from '@/funcs/commonFuncs';


const props=defineProps(['user','isInRel','blocked'])
const showUser=inject('showUser')


</script>