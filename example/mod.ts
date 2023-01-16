import { initTranslate } from "../mod.ts"
import mainLang from "./en.ts"

const { t } = initTranslate(mainLang);

const translated = t("deep.plural", { count: 10 })
console.log(translated);