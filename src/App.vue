<template>

  <v-app :class="{'dark':dark}" :theme="getTheme">
    <v-main>


      <suspense>
        <!-- <tg-log-in-page v-if="!pb.authStore?.isValid"></tg-log-in-page>
  <tg-provider v-else> -->
      <!-- <tg-main> -->
      <tg-wrapper>
        <router-view></router-view>
      </tg-wrapper>

        <!-- <template #main><suspense><tg-main-page v-if="currentPage=='main'"></tg-main-page></suspense><suspense><tg-chat-page v-if="currentPage=='chat'"></tg-chat-page></suspense><tg-settings-page v-if="currentPage=='settings'"></tg-settings-page><suspense><tg-contacts-page v-if="currentPage=='contacts'"></tg-contacts-page></suspense></template> -->
        <!-- <template #sideBarItems><tg-side-bar-items></tg-side-bar-items></template> -->
        <!-- <template #appBar><tg-main-app-bar v-if="currentPage=='main'"></tg-main-app-bar><tg-chat-app-bar v-if="(currentPage=='chat' && !showUser)"></tg-chat-app-bar><tg-settings-app-bar v-if="currentPage=='settings'"></tg-settings-app-bar><tg-contacts-app-bar v-if="currentPage=='contacts'"></tg-contacts-app-bar><tg-user-app-bar v-if="(currentPage=='chat' && showUser)"></tg-user-app-bar></template> -->
      <!-- </tg-main> -->
    <!-- </tg-provider> -->
</suspense>
    </v-main>
  </v-app>


</template>

<script setup>
import pb from '@/main';
import { ref, provide, onMounted } from 'vue';

import tgWrapper from '@/tgWrapper.vue'
// import tgMain from './components/tgMain.vue';
// import tgSideBarItems from './components/tgSideBarItems.vue';
// import tgMainAppBar from './components/tgMainAppBar.vue';
// import tgChatAppBar from './components/tgChatAppBar.vue';
// import tgSettingsAppBar from './components/tgSettingsAppBar.vue';
// import tgMainPage from './components/tgMainPage.vue';
// import tgChatPage from './components/tgChatPage.vue';
// import tgSettingsPage from './components/tgSettingsPage.vue';
// import tgContactsPage from './components/tgContactsPage.vue';
// import tgContactsAppBar from './components/tgContactsAppBar.vue';
import tgProvider from './tgProvider.vue';
// import tgUserPage from './components/tgUserPage.vue';
// import tgUserAppBar from './components/tgUserAppBar.vue';
import tgLogInPage from './components/tgLogInPage.vue';
// import { tgpLogIn } from "./pages/tgpLogIn.vue";

// import tst from './components/tst.vue';

// const dark=ref(localStorage.getItem('tgDark') == 'true')
const drawer= ref(false);
// provide('dark', dark)
provide('drawer', drawer)


// const currentPage=ref(pb.authStore.isValid ? 'main' : 'login')
// provide('currentPage', currentPage)


// const showUser=ref(false)
// provide('showUser', showUser)

import {storeToRefs} from 'pinia'
import {useSettingsStore} from '@/store/settingsStore'
import { useDataStore } from '@/store/dataStore';

const {getTheme}=storeToRefs(useSettingsStore())

// const{updateRels,updateAllMessages}=useDataStore()
// onMounted(()=>{updateRels().then(()=>{updateAllMessages().then(()=>{const{allMessages}=useDataStore();console.log('all -> ',allMessages);console.log('init...')})})})


</script>
