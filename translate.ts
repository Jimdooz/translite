export type TranslateStructure = {
    [key: string]: string | TranslateStructure,
} & SpecialTranslateStructure

type SpecialTranslateStructure = {
    [specialKey: SpecialCase]: SpecialTranslateContent
}

type SpecialTranslateContent = {
    [special: string]: string,
}

const parserSettings = {
    delimiterStart: "{",
    delimiterEnd: "}",
} as const;

//#region specialcas$param1_param2_paramN
type Decompose_<S> = S extends `${infer partLeft}_${infer partRight}` ? partLeft | Decompose_<partRight> : S;
type ArrayDecompose_<S> = S extends `${infer partLeft}_${infer partRight}` ? [partLeft, ...ArrayDecompose_<partRight>] : [S];

type SpecialCase = `${string}$${string}`;
type GetSpecialHead<T> = T extends `${infer H}$${string}` ? H : never;
type GetSpecialParams<T> = T extends `${string}$${infer P}` ? Decompose_<P> : never;
type ArraySpecialParams<T> = T extends `${string}$${infer P}` ? ArrayDecompose_<P> : never;

type GetFirstParam<T> = { [K in keyof T]: K extends `${infer partLeft}_${string}` ? partLeft : K extends string ? K : never }[keyof T];
type GetOtherParam<T> = {
    [Property in { [K in keyof T]: K extends `${string}_${infer partRight}` ? partRight : '\0' }[keyof T]]: Property
};
type AllParam<K> = K extends `${infer partLeft}_${infer partRight}` ? [partLeft, ...AllParam<partRight>] : [K];

type GetParamsDictionnary<H, C> = H extends [head: infer A extends string, ...tail: infer B extends string[]] ? ('\0' extends GetFirstParam<C> ? { [e in A]?: Exclude<GetFirstParam<C>, '\0'> } : { [e in A]: GetFirstParam<C> }) & GetParamsDictionnary<B, GetOtherParam<C>> : {}
//#endregion

type ValidHeadTrad<K extends TranslateStructure> = { [E in keyof K]: E extends `$${infer Head}` ? Head : E }[keyof K];
type ValidHeadTradLitteral<K extends TranslateStructure> = { [E in keyof K]: E extends `$${infer Head}` ? never : (K[E] extends string ? E : never) }[keyof K];

type Space = `${string} ${string}`;
type Words<K extends string> = K extends `${infer partLeft} ${infer partRight}` ? partLeft | Words<partRight> : K;
// type Params<K extends string> = K extends `{${string}}` ? K : never;
// type ParamsTrad<K extends string> = Params<Words<K>>;
// type ParamsName<K extends string> = K extends `${typeof parserSettings.delimiterStart}${infer P}${typeof parserSettings.delimiterEnd}` ? P : never;
type ParamsName<K extends string> = K extends `${typeof parserSettings.delimiterStart}${infer P}${typeof parserSettings.delimiterEnd}` ? (P extends `-${infer L}` ? L : (P extends `@${infer L}` ? L : P)) : never;
type ParamsNameTrad<K extends string> = ParamsName<Words<K>>;

export type ConstraintParams<K extends string | unknown> = K extends string ? {
    [Property in ParamsNameTrad<K>]: string | number;
} : never;

// export type ConstraintParamsTuple<K extends [string, string | unknown]> = K[1] extends string ? {
//     [Property in ParamsNameTrad<K[1]>]: string | number;
// } : K[1] extends SpecialTranslateContent ? GetParamsDictionnary<ArraySpecialParams<K[0]>, K[1]> : never;

/**
 * NEW VERSION
 */
type Tail<T> = T extends [head: infer A extends any, ...tail: infer B extends any[]] ? B : [];

type DispatchValue<K extends any[], V extends any[]> = K extends [head: infer A extends string, ...tail: infer B extends string[]] ?
    (V[0] extends '*' ? { [i in A]?: Omit<string, never> } : (V[0] extends undefined ? { [i in A]?: Omit<string, never> } : { [i in A]: V[0] })) & DispatchValue<B, Tail<V>>
    : {};

type AllValues<K extends any[], V> = {
    [I in keyof V]: DispatchValue<K, AllParam<I>>
}

type UnionValues<T> = T[keyof T];

export type ConstraintParamsTuple<K extends [string, string | unknown]> = K[1] extends string ? {
    [Property in ParamsNameTrad<K[1]>]: string | number;
} : K[1] extends SpecialTranslateContent ? UnionValues<AllValues<ArraySpecialParams<K[0]>, K[1]>> : never;

/**
 * Obtain all nested key
 * - Catch special case 
 */
export type DeepKeys<K extends TranslateStructure> = { [E in keyof K]: E extends string ?
    K[E] extends TranslateStructure ? (E extends SpecialCase ? GetSpecialHead<E> : `${E}.${DeepKeys<K[E]>}`) : E
    : never
}[keyof K];

/**
 * Obtain all nested key value
 * - Catch special case 
 */
type ValidSpecialCase<K extends string, O extends TranslateStructure> = { [I in keyof O]: I extends SpecialCase ? (K extends GetSpecialHead<I> ? I : never) : never }[keyof O]

type IntermediateDeepValue<K extends string, Intermediate extends TranslateStructure> =
    ValidSpecialCase<K, Intermediate> extends never ? Intermediate[K] : Intermediate[ValidSpecialCase<K, Intermediate>];

export type DeepValue<K extends string, G extends TranslateStructure> = K extends `${infer Head}.${infer Tail}` ?
    G[Head] extends TranslateStructure ? DeepValue<Tail, G[Head]> : never
    : IntermediateDeepValue<K, G>;

export type DeepValueTuple<K extends string, G extends TranslateStructure> = K extends `${infer Head}.${infer Tail}` ?
    G[Head] extends TranslateStructure ? DeepValueTuple<Tail, G[Head]> : never
    : [ValidSpecialCase<K, G>, IntermediateDeepValue<K, G>];

export type TranslationModel<T extends TranslateStructure> = { [K in keyof T]: T[K] extends TranslateStructure ? TranslationModel<T[K]> : string };

export type LangFile<T> = { default: T, }

export type Translate<T extends TranslateStructure> = {
    translate<K extends DeepKeys<T>, P extends ConstraintParams<DeepValue<K, T>>>(key: K, ...params: P extends Record<string, never> ? [] : [P]): string
}

export type TranslationDictionnary<T extends TranslateStructure> = {
    [key: string]: Translate<T>,
}

// {{((?:(?!}}).)+)}}
const regexPattern = new RegExp(`${parserSettings.delimiterStart}((?:(?!${parserSettings.delimiterEnd}).)+)${parserSettings.delimiterEnd}`, 'g');
const accepted = ['undefined', 'Date', 'Math', 'eval'];
const safeContext = () => Object.getOwnPropertyNames(window).map((v) => { return accepted.includes(v) ? '' : `let ${v} = undefined;` }).join('') + ``;

function evalParameter(params: { [key: string]: any }) {
    let parameters = '';
    for (const key in params) {
        parameters += `let ${encodeURIComponent(key)} = ${JSON.stringify(params[key])};`;
    }
    return parameters;
}

export function initTranslate<T extends TranslateStructure>(translation?: T) {
    return {
        translate<K extends DeepKeys<T>, P extends ConstraintParamsTuple<DeepValueTuple<K, T>>>(key: K, ...params: P extends Record<string, never> ? [] : [P]) {
            const path = key.split('.');
            let deepObj: TranslateStructure = translation ?? {};
            for (let i = 0; i < path.length - 1; i++) {
                deepObj = deepObj[path[i]] as TranslateStructure;
            }

            const rawKeys = Object.keys(deepObj);
            const sanitizeKeys = Object.keys(deepObj).map((value, index) => { return value.split('$')[0] });
            const specialKeys = Object.keys(deepObj).map((value, index) => { return rawKeys[index] != sanitizeKeys[index] });
            const wantedKey = path.at(-1) ?? '';

            const indexFound = sanitizeKeys.indexOf(wantedKey);

            const translateValueRaw = deepObj[rawKeys[indexFound]];
            if (!translateValueRaw) return "__INVALID_TRANSLATION__"; //TODO

            const param: P = (params as any)[0]!;

            // console.log(translateValue);
            let translateValue = translateValueRaw as string;
            //Special case
            if(specialKeys[indexFound]){
                translateValue = ''; //Reset value
                //Create score
                const scores : {[key: string] : number} = {};
                for (const scoreKey in translateValueRaw as SpecialTranslateContent){
                    const element = scoreKey.split('_');
                    let score = 0;
                    for(let i = 0; i < element.length; i++) score += element[i] == '*' ? 0 : 1;
                    scores[scoreKey] = score;
                }

                const flatKeys = Object.keys(translateValueRaw as SpecialTranslateContent).sort((a, b) => {
                    return scores[b] - scores[a];
                });

                const paramDefinition = rawKeys[indexFound].split('$')[1].split('_');

                for(const propose of flatKeys){
                    const proposeParam = propose.split('_');
                    let valid = true;
                    for(const paramKey in paramDefinition){
                        const paramElement = paramDefinition[paramKey];
                        const paramValue = (param as any)?.[paramElement];
                        // console.log(propose, paramKey, paramElement, '|', paramValue, proposeParam[paramKey]);
                        if (!proposeParam[paramKey] || proposeParam[paramKey] == '*' || proposeParam[paramKey] == paramValue) continue;
                        valid = false; break;
                    }
                    if (valid) {
                        translateValue = (translateValueRaw as SpecialTranslateContent)[propose];
                        break;
                    }
                }
                // console.log(flatKeys, param, paramDefinition, translateValue);

                if (!translateValue) return "__INVALID_TRANSLATION__"; //TODO
            }

            console.log(translateValue);

            if (param) {
                const localContext = {};
                translateValue = translateValue.replaceAll(regexPattern, (match, content, ..._args) => {
                    const unescapedMode = content['0'] == '-';
                    const declarativeMode = content['0'] == '@';
                    const execMode = content['0'] == '$';

                    if (execMode) {
                        const toEval = `"use strict"; ${safeContext()}; ${evalParameter(param)}; return ${(content as string).substring(1, content.length)}`;
                        try {
                            const result = new Function(toEval).call(localContext); //(0, eval)(toEval);
                            return result;
                        } catch (_e) {
                            console.log(_e);
                            return 'EVAL_ERROR';
                        }
                    }

                    if (declarativeMode) return '';

                    const key = unescapedMode ? (content as string).substring(1, content.length) : content;
                    const value = (param as any)[key];
                    if (!value) return match;
                    if (!unescapedMode) return encodeURI(value);
                    return value;
                });
            }
            return translateValue.trim();
        }
    };
}
