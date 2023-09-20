import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings',{
    state:()=>({isDark:localStorage.getItem('tgDark') == 'true'}),
    getters:{
        getTheme:(state)=>(state.isDark ? 'dark' : 'light')
    }
})
