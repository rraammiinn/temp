<template>
    <v-list-item @contextmenu.prevent="showActions=true;" @click="()=>{if(!props.isCurrentAccount && !showActions)$emit('changeAccount', props.account.model.id)}" :title="props.account.model.name" style="padding-left: .5rem;">
                <template #prepend>
                    <v-badge v-if="props.isCurrentAccount" icon="mdi-check">
                        <v-avatar :image="getUserAvatarUrl(props.account.model.id, props.account.model.avatar)"></v-avatar>
                    </v-badge>
                    <v-avatar v-else :image="getUserAvatarUrl(props.account.model.id, props.account.model.avatar)"></v-avatar>
                </template>
                <template v-slot:append v-if="showActions"><v-btn @click.stop="showActions=false;" variant="text" icon="mdi-close"></v-btn><v-btn @click.stop="$emit('deleteAccount', props.account.model.id)" variant="text" color="error" icon="mdi-delete"></v-btn></template>
            </v-list-item>
</template>

<script setup>
// import {pb} from '@/funcs/pb';
import { ref } from 'vue';
import { getUserAvatarUrl } from '@/funcs/commonFuncs';
// import { useDataStore } from '@/store/dataStore';

// const {deleteAccount} = useDataStore()


const props = defineProps(['account', 'isCurrentAccount'])

const showActions = ref(false)
</script>