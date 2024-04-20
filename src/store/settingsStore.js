import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings',{
    state:()=>({theme:localStorage.getItem('tgTheme') ?? (window.matchMedia('(prefers-color-scheme : dark)').matches ? 'dark' : 'light')}),
    // getters:{
    //     getTheme:(state)=>(state.theme ?? (window.matchMedia('(prefers-color-scheme : dark)').matches ? 'dark' : 'light'))
    // }
})
