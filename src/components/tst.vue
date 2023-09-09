<template>
<div class="image-upload">
    <label for="file-input">
      <button @click="inp.click()" style="width: 5rem;height: 5rem;background-color: blue;">sss</button>
        <!-- <img src="../../icon.png"/> -->
    </label>

    <input @change="(e)=>{console.log(e)}" ref="inp" id="file-input" type="file"/>
</div>
</template>

<style scoped>
.image-upload > input
{
    display: none;
}

.image-upload img
{
    width: 10rem;
    height: 10rem;
    cursor: pointer;
}
</style>

<script setup>
import { ref } from 'vue';

const inp=ref()
</script>