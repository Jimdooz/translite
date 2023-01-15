import { initTranslate, LangFile } from "../mod.ts"
import mainLang from "./en.ts"

const lang = "en";

async function LoadTranslation(lang: string) {
    const { default: translation }: LangFile<typeof mainLang> = await import(`./${lang}.ts`);
    const { translate } = initTranslate(translation);
    return translate;
}

const translate = await LoadTranslation(lang);

translate("deep.complex", {
   gender: "male",
   count: "1",
   cute:"true", 
});