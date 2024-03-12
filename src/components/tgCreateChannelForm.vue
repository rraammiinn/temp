<template>
    <v-card style="padding: 1rem;">
    <v-col>
    <v-text-field dir="auto" v-model="modelValue.name" color="primary" variant="outlined" label="name"></v-text-field>
    <v-textarea v-model="modelValue.about" rows="1" auto-grow color="primary" variant="outlined" label="about"></v-textarea>
    <v-file-input accept="image/*" v-model="modelValue.avatar" label="avatar" prepend-inner-icon="mdi-image" :prepend-icon="null" variant="outlined"></v-file-input>

    <v-row>
        <v-btn @click="$emit('click:cancel')" style="margin-left: .75rem;margin-bottom: .5rem;margin-top: .5rem;" color="error">cancel</v-btn>
        <v-btn @click="$emit('click:create')" style="margin-left: .75rem;margin-bottom: .5rem;margin-top: .5rem;" color="primary">create</v-btn>
    </v-row>
</v-col>
  </v-card>
</template>{}

<script setup>

const modelValue=defineModel({default:{}})

</script>