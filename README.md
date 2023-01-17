# Translite 🌎💬

Translite is a simple and easy to use translation library. It's designed to make it easy to translate your application with minimal setup and configuration.

## Features 📋
Simple and easy to use API
- Auto-completion with TypeScript
- Variable substitution
- Dynamic translation
- Contextualization

## Usage 🚀

Define your main language format as a reference for other translations.

```ts
//en.ts
import type { TranslateStructure, TranslationModel } from "https://deno.land/x/translite/mod.ts";

const translation = {
    hello: "Hello !",
    welcome: "Welcome to {place}"
} as const satisfies TranslateStructure;

export type Model = TranslationModel<typeof translation>;

export default translation;
```

In your main file, import the `initTranslate` function and the main language file, and use the `t` function to translate your strings.

```ts
//main.ts
import type { initTranslate } from "https://deno.land/x/translite/mod.ts";
import EN from "./en.ts"

const { t } = initTranslate(EN);

t('hello'); //Hello !
t('welcome', { place: "Translite" }); //Welcome to Translite
```

To add other languages, you can use the same structure as your main language file and import them in your main file.

```ts
import {Model} from "./en.ts"

export default {
    hello: "Bonjour !",
    welcome: "Bienvenue à {place}"
} satisfies Model;
```

With this syntax you can ensure your other translation to follow the same structure than your reference language, here en.ts

## Advanced usage 🔎

### Nested translation keys

Translite supports nested translation keys, allowing you to organize your translation strings in a hierarchical structure. For example:

```ts
const translation = {
    foo: {
        bar: "This is a nested translation"
    }
}
```

You can access nested keys using dot notation:

```ts
t("foo.bar") //This is a nested translation
```

### Dynamic translation

Translite allows you to include dynamic elements in your translation strings. You can use `{@<param>}` to declare a variable that can be used later, and `{$<code>}` to generate dynamic values.
```ts
const translation = {
    plural: "{@count} shoe{$ count > 1 ? 's' : '' }",
}
```

And use it

```ts
t("plural", { count : 10 }) //shoes
```
**note** : *The code inside the {$...} is executed in a secure sandbox, ensuring that it cannot access or modify any sensitive data.*

### Contextual translation

Translite supports contextual translations, allowing you to create different translations for the same key based on certain context. The key format is `<key>$<param0>_<param1>_...`, with the children following this pattern `<value0>_<value1>_... : "translation"`. . You can use '*' to catch any value.

For example :

```ts
const translation = {
    friend$gender_count: {
        "male_1"    : "A boyfriend",
        "male_*"    : "{count} boyfriends",
        "female_1"  : "A girlfriend",
        "female_*"  : "{count} girlfriends",
    }
}
```
You can use it like this:
```ts
t("friend", { gender : 'male', count : 2 }) // 2 boyfriends
```
This allows for more accurate and specific translations based on the context of your application.