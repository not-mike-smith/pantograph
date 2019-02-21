import * as p from "./index";

type Foo = {
    x: string,
    y: boolean,
    z: null | boolean,
};

type Bar = p.Expanded<Foo>;

const createExpander = <T>(fcnsHolder: any): (obj: T) => p.Expanded<T> => {
    return (condensedObj: T): p.Expanded<T> => {
        return Object.keys(fcnsHolder).reduce(
            (expandedObj: any, currentName: string) => {
                const variableExpander = fcnsHolder[currentName] as (value: any) => p.IExpandedVariable<any>;
                expandedObj[currentName] = variableExpander(condensedObj[currentName])

                return expandedObj;
            },
            {}) as p.Expanded<T>;
    };
};

const condense = <T>(expandedObj: p.Expanded<T>): T => {
    return Object.keys(expandedObj).reduce(
        (condensedObj: Partial<T>, currentName: string): Partial<T> => {
            const expandedVar = expandedObj[currentName] as p.IExpandedVariable<any>;
            if (!expandedVar._isExpandedVariable) return condensedObj;

            condensedObj[currentName] = expandedVar.textValue === null
                ? null
                : expandedVar.parse(expandedVar.textValue);

            return condensedObj;
        },
        {}
    ) as T;
};

const required = <T>(
    parse: (textValue: string) => null | T,
    unparse: (value: T) => string,
    initialValue: null | T = null,
): p.RequiredVariable<T> => {
    return {
        value: initialValue,
        textValue: initialValue === null ? null : unparse(initialValue),
        parse,
        isRequired: true,
        _isExpandedVariable: true
    };
};

const optional = <T>(
    parse: (textValue: string) => null | T,
    unparse: (value: T) => string,
    initialValue: null | T = null,
): p.OptionalVariable<T> => {
    return {
        value: initialValue,
        textValue: initialValue === null ? null : unparse(initialValue),
        parse,
        isRequired: false,
        _isExpandedVariable: true
    };
};

const expandRequired = <T>(
    parse: (textValue: string) => null | T,
    unparse: (value: T) => string
): (initialValue: null | T) => p.RequiredVariable<T> => {
    return (initialValue: null | T = null): p.RequiredVariable<T> => {
        return required(parse, unparse, initialValue);
    };
};

const expandOptional = <T>(
    parse: (textValue: string) => null | T,
    unparse: (value: T) => string
): (initialValue: null | T) => p.OptionalVariable<T> => {
    return (initialValue: null | T = null): p.OptionalVariable<T> => {
        return optional(parse, unparse, initialValue);
    };
};

const passThrough = (s: string) => s;

const requiredString = expandRequired<string>(passThrough, passThrough);

const optionalString = expandOptional<string>(passThrough, passThrough);

const parseIntOrNull = (s: string): null | number => {
    const i = parseInt(s);
    if (isNaN(i)) return null;

    return i;
};

const requiredInt = expandRequired<number>(parseIntOrNull, int => int.toString());

const optionalInt = expandOptional<number>(parseIntOrNull, int => int.toString());

const parseFloatOrNull = (s: string): null | number => {
    const f = parseFloat(s);
    if (isNaN(f)) return null;

    return f;
};

const requiredFloat = expandRequired<number>(parseFloatOrNull, f => f.toString());

const optionalFloat = expandOptional<number>(parseFloatOrNull, f => f.toString());

const parseYesNo = (yesNo: string): null | boolean => {
    const yn = yesNo.toLowerCase();
    if (yn === "yes" || yn === "y") return true;
    if (yn === "no" || yn === "n") return false;

    return null;
}

const unparseYesNo = (b: boolean) => b ? "Yes" : "No";

const requiredYesNo = expandRequired<boolean>(parseYesNo, unparseYesNo);

const optionalYesNo = expandOptional<boolean>(parseYesNo, unparseYesNo);

