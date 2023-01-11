export type TranslateStructure = {
    [key: string]: string | TranslateStructure,
}

const parserSettings = {
    delimiterStart : "{{",
    delimiterEnd : "}}",
} as const;

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

export type DeepKeys<K extends TranslateStructure> = { [E in keyof K]: E extends string ?
    K[E] extends TranslateStructure ? `${E}.${DeepKeys<K[E]>}` : E
    : never
}[keyof K];

export type DeepValue<K extends string, G extends TranslateStructure> = K extends `${infer Head}.${infer Tail}` ?
    G[Head] extends TranslateStructure ? DeepValue<Tail, G[Head]> : never
    : G[K];

export type ModelTranslation<T extends TranslateStructure> = { [K in keyof T]: T[K] extends TranslateStructure ? ModelTranslation<T[K]> : string };

export type LangFile<T> = { default: T, }

export type TranslationModel<T extends TranslateStructure> = {
    translate<K extends DeepKeys<T>, P extends ConstraintParams<DeepValue<K, T>>>(key: K, ...params: P extends Record<string, never> ? [] : [P]) : string
}

export type TranslationDictionnary<T extends TranslateStructure> = {
    [key: string] : TranslationModel<T>,
}

// {{((?:(?!}}).)+)}}
const regexPattern = new RegExp(`${parserSettings.delimiterStart}((?:(?!${parserSettings.delimiterEnd}).)+)${parserSettings.delimiterEnd}`, 'g');
const accepted = ['undefined', 'Date', 'Math']
const safeEval = Object.getOwnPropertyNames(window).map((v) => { return accepted.includes(v) ? '' : `let ${v} = undefined;` }).join('') + ``;

function evalParameter(params: {[key: string] : any}){
    let parameters = '';
    for(const key in params){
        parameters += `let ${encodeURIComponent(key)} = ${JSON.stringify(params[key])};`;
    }
    return parameters;
}

export function initTranslate<T extends TranslateStructure>(translation?: T): TranslationModel<T> {
    return {
        translate<K extends DeepKeys<T>, P extends ConstraintParams<DeepValue<K, T>>>(key: K, ...params: P extends Record<string, never> ? [] : [P]) {
            const path = key.split('.');
            let deepObj: TranslateStructure = translation ?? {};
            for (let i = 0; i < path.length - 1; i++) {
                deepObj = deepObj[path[i]] as TranslateStructure;
            }
            let translateValue = deepObj[path.at(-1) ?? ''] as string;
            if (!translateValue) return "__INVALID_TRANSLATION__"; //TODO
            const param: P = (params as any)[0]!;
            if (param) {
                translateValue = translateValue.replaceAll(regexPattern, (match, content, ...args) => {
                    const unescapedMode = content['0'] == '-';
                    const declarativeMode = content['0'] == '@';
                    const execMode = content['0'] == '$';
                    
                    if (execMode){
                        const toEval = `${safeEval}; "use strict"; ${evalParameter(param)}; ${(content as string).substring(1, content.length).replaceAll('this', '_this')}`;
                        try{
                            const result = (0, eval)(toEval);
                            return result;
                        }catch(_e){
                            return 'EVAL_ERROR';
                        }
                    }
                    
                    if (declarativeMode) return '';

                    const key = unescapedMode ? (content as string).substring(1, content.length) : content;
                    const value = (param as any)[key];
                    if(!value) return match;
                    if (!unescapedMode) return encodeURI(value);
                    return value;
                });
            }
            return translateValue.trim();
        }
    };
}