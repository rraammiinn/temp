<template>


    <div class="main">
        <img v-if="isLoggedIn" style="width: 100%;" :src="`/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`" alt="">
        <div style="width: 100%;margin-bottom: 1rem;">
            <v-btn @click="upload" icon="mdi-upload" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
        </div>
        <v-col style="padding: 1rem;">

            <v-file-input
            accept="image/*"
            label="image"
prepend-icon="mdi-upload"
variant="outlined"
v-model="file"
@change="upload_"

></v-file-input>


            <v-text-field
            label="name"
            persistent-hint
            variant="outlined"
            v-model="name"
            
          ></v-text-field>
          <v-textarea
          label="bio"
          auto-grow
          variant="outlined"
          rows="3"
          row-height="25"
          shaped
          v-model="bio"
        ></v-textarea>
        <div style="margin-left: auto;width: fit-content;">
            <v-btn @click="cancel" prepend-icon="mdi-cancel" style="margin-right: 1rem;">cancel</v-btn>
            <v-btn @click="change" prepend-icon="mdi-check">change</v-btn>
        </div>
        <v-divider style="margin-top: 3rem;margin-bottom: 3rem;"/>
        <v-btn @click="logOut" v-if="isLoggedIn" color="error" prepend-icon="mdi-logout">log out</v-btn>
        <v-btn @click="logIn" v-else color="primary" prepend-icon="mdi-login">log in</v-btn>
        </v-col>
    </div>

</template>

<style scoped>
.main{
    max-width: 50rem;
    margin: auto;
}
</style>

<script setup>
import pb from '@/main';
import { inject, ref } from 'vue';

const isLoggedIn = inject('isLoggedIn')
const currentPage=inject('currentPage')


async function logIn(){
    // authData.value = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    // isLoggedIn.value = pb.authStore.isValid
    currentPage.value='login'
}
function logOut(){
    pb.authStore.clear();
    isLoggedIn.value = pb.authStore.isValid
}





const file = ref()
// const formData = new FormData();
const name =ref('')
const bio =ref('')


async function upload()
{
    const pickerOpts = {
  types: [
    {
      description: "avatar",
      accept: {
        "image/*": [],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

    var formData = new FormData();
    const handler = await window.showOpenFilePicker(pickerOpts)
    const image = await handler[0].getFile()
    console.log(image)

    formData.append('avatar', image);
    await pb.collection('users').update(pb.authStore.model.id, formData);

}



async function upload_(){
    var formData = new FormData();
    formData.append('avatar', file.value[0]);
    await pb.collection('users').update(pb.authStore.model.id, formData);

}



async function change(){
    await pb.collection('users').update(pb.authStore.model.id, {'name':name.value, 'bio':bio.value});
}

function cancel(){
    name.value=''
    bio.value=''
}
</script>