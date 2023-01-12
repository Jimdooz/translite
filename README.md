# Quick Translation

```ts
import type { TranslateStructure, ModelTranslation } from "@translate/mod.ts";

const translation = {
    hello: "Hello !",
    presentation: "My name is {-firstname} {lastname}",
    deep: {
        translation: "Result of addition : {a} + {b} = {$ a + b }",
        plural: "{@count} shoe{$ count > 1 ? 's' : '' }",
    }
} as const satisfies TranslateStructure;

export type Model = TranslationModel<typeof translation>;

export default translation;
```

```ts
import type {Model} from "./en.ts";

export default {
    hello: "Bonjour !",
    presentation: "Bonjour je suis {-firstname} {lastname}",
    deep: {
        translation: "Résultat de l'addition : {a} + {b} = {$ a + b}",
        plural: "{@count} chaussure{$ count > 1 ? 's' : '' }",
    }
} as const satisfies Model;
```

```ts
import { initTranslate, LangFile } from "@translate/mod.ts"
import mainLang from "./translation/en.ts"

const lang = "fr";
const { default: translation }: LangFile<typeof mainLang> = await import(`./translation/${lang}.ts`);
const { translate } = initTranslate(translation);

const translate = await LoadTranslation(lang);

//Bonjour je suis <i>John</i> Doe
translate("presentation", { firstname: "<i>John</i>", lastname: "Doe" });
 // "Résultat de l'addition : 5 + 10 = 15"
translate("deep.translation", { a: 5, b: 10 });
// chaussure
translate("deep.plural", { count: 0});
// chaussures
translate("deep.plural", { count: 10});
```