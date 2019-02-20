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

// Do these next!

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

const requiredString = (initialValue: null | string = null): p.RequiredVariable<string> => {
    return required(passThrough, passThrough, initialValue);
};

const optionalString = (initialValue: null | string = null): p.OptionalVariable<string> => {
    return optional(passThrough, passThrough, initialValue);
};

const parseIntOrNull = (s: string): null | number => {
    const i = parseInt(s);
    if (isNaN(i)) return null;

    return i;
};

const requiredInt = (initialValue: null | number = null): p.RequiredVariable<number> => {
    return required(
        parseIntOrNull,
        (int: number) => int.toString(),
        initialValue
    );
};

const optionalInt = (initialValue: null | number = null): p.OptionalVariable<number> => {
    return optional(
        parseIntOrNull,
        (int: number) => int.toString(),
        initialValue);
};

const parseFloatOrNull = (s: string): null | number => {
    const f = parseFloat(s);
    if (isNaN(f)) return null;

    return f;
};

const requiredFloat = (initalValue: null | number = null) => {
    return required(
        parseFloatOrNull,
        f => f.toString(),
        initalValue
    );
};

const optionalFloat = (initialValue: null | number = null) => {
    return optional(
        parseFloatOrNull,
        f => f.toString(),
        initialValue
    );
};

const parseYesNo = (yesNo: string): null | boolean => {
    const yn = yesNo.toLowerCase();
    if (yn === "yes" || yn === "y") return true;
    if (yn === "no" || yn === "n") return false;

    return null;
}

const unparseYesNo = (b: boolean) => b ? "Yes" : "No";

const requiredYesNo = (initialValue: null | boolean = null): p.RequiredVariable<boolean> => {
    return required(
        parseYesNo,
        unparseYesNo,
        initialValue
    );
};

const optionalYesNo = (initialValue: null | boolean = null): p.OptionalVariable<boolean> => {
    return optional(
        parseYesNo,
        unparseYesNo,
        initialValue
    );
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

