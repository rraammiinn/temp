<template>

  <v-app :theme="dark ? 'dark' : 'light'">
    <v-main>
      <suspense>
  <tg-provider>
      <tg-main>
        <template #main><suspense><tg-main-page v-if="currentPage=='main'"></tg-main-page></suspense><suspense><tg-chat-page v-if="currentPage=='chat'"></tg-chat-page></suspense><tg-settings-page v-if="currentPage=='settings'"></tg-settings-page><suspense><tg-contacts-page v-if="currentPage=='contacts'"></tg-contacts-page></suspense></template>
        <template #sideBarItems><tg-side-bar-items></tg-side-bar-items></template>
        <template #appBar><tg-main-app-bar v-if="currentPage=='main'"></tg-main-app-bar><tg-chat-app-bar v-if="currentPage=='chat'"></tg-chat-app-bar><tg-settings-app-bar v-if="currentPage=='settings'"></tg-settings-app-bar><tg-contacts-app-bar v-if="currentPage=='contacts'"></tg-contacts-app-bar></template>
      </tg-main>
    </tg-provider>
</suspense>
    </v-main>
  </v-app>

</template>

<script setup>
// import PocketBase from 'pocketbase';
import { ref, provide } from 'vue';
import tgMain from './components/tgMain.vue';
import tgSideBarItems from './components/tgSideBarItems.vue';
import tgMainAppBar from './components/tgMainAppBar.vue';
import tgChatAppBar from './components/tgChatAppBar.vue';
import tgSettingsAppBar from './components/tgSettingsAppBar.vue';
import tgMainPage from './components/tgMainPage.vue';
import tgChatPage from './components/tgChatPage.vue';
import tgSettingsPage from './components/tgSettingsPage.vue';
import tgContactsPage from './components/tgContactsPage.vue';
import tgContactsAppBar from './components/tgContactsAppBar.vue';
import tgProvider from './tgProvider.vue';

// import tst from './components/tst.vue';

const dark=ref(false)
const drawer= ref(false);
provide('dark', dark)
provide('drawer', drawer)
// const other=ref()
// provide('other', other)

const currentPage=ref('main')
provide('currentPage', currentPage)

// import pb from './main';
// const isLoggedIn = ref(pb.authStore.isValid)
// provide ('isLoggedIn', isLoggedIn)



// const chats = ref(await pb.collection('messages').getFullList({
//     sort: 'created',
// }));

// pb.collection('messages').subscribe('*', function (e) {
//         chats.value.push(e.record)
// });

// provide('chats', chats)

</script>
