import type { TranslateStructure, TranslationModel } from "../mod.ts";

const translation = {
    hello: "Hello !",
    presentation: "My name is {firstname} {lastname}",
    deep: {
        translation: "Result of addition : {a} + {b} = {$ a + b }",
        plural: "{@count} shoe{$ count > 1 ? 's' : '' }",
        multiple: "{@gender} {@count} {$count > 1 ? count : 'A'} {$gender == 'male' ? 'boyfriend' : 'girlfriend'}{$count > 1 ? 's' : ''}",
        $complex$gender_count: {
            male_0: "A boyfriend",
            female_0: "A female",
            male: "{count} boyfriends",
            female: "{count} girlfriends",
        }
    },
} as const satisfies TranslateStructure;

export type Model = TranslationModel<typeof translation>;

export default translation;