import { initTranslate } from "../mod.ts"
import mainLang from "./en.ts"

async function LoadTranslation(lang: string) {
    return initTranslate((await import(`./${lang}.ts`)).default as typeof mainLang);
}

const { t } = await LoadTranslation('fr');

const translated = t("deep.inlinefriend", { gender: "female", count: 1 });

console.log(translated);