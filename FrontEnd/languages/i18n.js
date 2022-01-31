import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import english from './english.json'
import sinhala from './sinhala.json'

i18next.use(initReactI18next).init({
    lng:'en',
    resources:{
        en:english,
        si:sinhala
    },
    react:{
        useSuspense:false
    }
})

export default i18next;