import type { TranslateStructure, TranslationModel } from "../mod.ts";

const translation = {
    hello: "Hello !",
    presentation: "My name is {firstname} {lastname}",
    deep: {
        translation: "Result of addition : {a} + {b} = {$ a + b }",
        plural: "{@count} shoe{$ count > 1 ? 's' : '' }",
        multiple: "{@gender} {@count} {$count > 1 ? count : 'A'} {$gender == 'male' ? 'boyfriend' : 'girlfriend'}{$count > 1 ? 's' : ''}",
        // https://www.i18next.com/translation-function/context equivalent
        friend$gender_count: {
            male_1 : "A boyfriend",
            female_1: "A girlfriend",
            "male_*": "{count} boyfriends",
            "female_*": "{count} girlfriends",
        }
    },
} as const satisfies TranslateStructure;

export type Model = TranslationModel<typeof translation>;

export default translation;