import {Model} from "./en.ts"

export default {
    hello: "Bonjour !",
    presentation: "Mon nom est {firstname} {lastname}",
    deep: {
        plural: "{@count} chaussure{$ count > 1 ? 's' : '' }",
        addition: "Résultat de l'addition : {a} + {b} = {$ a + b }",
        inlinefriend: "{@gender} {@count} {$count > 1 ? count : (gender == 'male' ? 'Un' : 'Une')} {$gender == 'male' ? 'ami' : 'amie'}{$count > 1 ? 's' : ''}",
        friend$gender_count: {
            "male_1": "Un ami",
            "female_1": "Une amie",
            "male_*": "{count} amis",
            "female_*": "{count} amies",
        },
    }
} satisfies Model;