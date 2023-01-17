# QuickTranslate 🌎💬

QuickTranslate is a simple and easy to use translation library for Deno. It's designed to make it easy to translate your application with minimal setup and configuration.

## Features 📋
Simple and easy to use API
- Auto-completion with TypeScript
- Variable substitution
- Dynamic translation
- Contextualization

## Usage 🚀

Define your main language format that serve to be the reference or the model

```ts
//en.ts
import type { TranslateStructure, TranslationModel } from "@qtranslate/mod.ts";

//Define your keys
const translation = {
    hello: "Hello !"
} as const satifies TranslateStructure;

//Define the model for other lang
export type Model = TranslationModel<typeof translation>;

export default translation;
```

Next you can use it to your main file

```ts
//main.ts
import type { initTranslate } from "@qtranslate/mod.ts";
import EN from "./en.ts"

const { t } = initTranslate(EN);

console.log(t('hello')); //Hello !
```

If you want to define other language you can use this syntax

```ts
import {Model} from "./en.ts"

export default {
    hello: "Bonjour !"
} satisfies Model;
```

With this syntax you can ensure your other translation to follow the same structure than your reference language, here en.ts