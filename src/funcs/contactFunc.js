import {pb} from '@/funcs/pb';
async function addContact(userId){
    await pb.collection('contacts').create({follower:pb.authStore.model.id, following:userId})
  }
  async function deleteContact(contactId){
    await pb.collection('contacts').delete(contactId);
  }
















  export{addContact,deleteContact}