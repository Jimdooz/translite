import {Model} from "./en.ts"

export default {
    hello: "Hello !",
    presentation: "sdpoksgodkgosij",
    deep: {
        plural: "{@count} chaussure{$ count > 1 ? 's' : '' }",
        addition: 'Result of addition : {a} + {b} = {$ a + b }',
        inlinefriend: "{@gender} {@count} {$count > 1 ? count : (gender == 'male' ? 'Un' :)} {$gender == 'male' ? 'boyfriend' : 'girlfriend'}{$count > 1 ? 's' : ''}",
        friend$gender_count: {
            "female_*": "{count} amies",
            "male_*": "{count} amis",
            female_1: "Une amie",
            male_1: "A boyfriend",
        },
    }
} satisfies Model;