import type { TranslateStructure, TranslationModel } from "../mod.ts";

const translation = {
    hello: "Hello !",
    presentation: "My name is {firstname} {lastname}",
    deep: {
        translation: "Result of addition : {a} + {b} = {$ a + b }",
        plural: "{@count} shoe{$ count > 1 ? 's' : '' }",
        multiple: "{@gender} {@count} {$count > 1 ? count : 'A'} {$gender == 'male' ? 'boyfriend' : 'girlfriend'}{$count > 1 ? 's' : ''}",
        $complex$gender_count_cute: {
            male_0: "No boyfriend",
            female_0: "No girlfriend",
            male_1: "A boyfriend",
            female_1: "A girlfriend",
            male_1_true: "A cute boyfriend",
            female_1_true: "A cute girlfriend",
            male: "{count} boyfriends",
            female: "{count} girlfriends",
        }
    },
} as const satisfies TranslateStructure;

export type Model = TranslationModel<typeof translation>;

export default translation;