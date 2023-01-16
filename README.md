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
import type { initTranslate } from "@qtranslate/mod.ts";
import EN from "./en.ts"

const { t } = initTranslate(EN);

console.log(t('hello')); //Hello !
```