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
    unParse: (value: T) => string,
    initialValue: null | T = null,
): p.RequiredVariable<T> => {
    return {
        value: initialValue,
        textValue: initialValue === null ? null : unParse(initialValue),
        parse,
        isRequired: true,
        _isExpandedVariable: true
    };
};

const expandRequired = <T>(
    parse: (textValue: string) => null | T,
    unParse: (value: T) => string
): (initialValue: null | T) => p.RequiredVariable<T> => {
    return (initialValue: null | T = null): p.RequiredVariable<T> => {
        return required(parse, unParse, initialValue
        );
    };
};

const requiredString = (initialValue: null | string = null): p.RequiredVariable<string> => {
    const passThrough = (s: string) => s;
    return required(passThrough, passThrough, initialValue);
}

const requiredInt = (initialValue: null | number = null): p.RequiredVariable<number> => {
    return required(
        (textValue: string) => parseInt(textValue),
        (int: number) => int.toString(),
        initialValue
    );
}

const requiredYesNo = (initialValue: null | boolean): p.RequiredVariable<boolean> => {
    return required(
        (textValue: string) => textValue.toLowerCase() === "yes",
        (value: boolean) => value ? "Yes" : "No",
        initialValue
    );
}

const optional = <T>(
    parse: (textValue: string) => null | T,
    unParse: (value: T) => string,
    initialValue: null | T = null,
): p.OptionalVariable<T> => {
    return {
        value: initialValue,
        textValue: initialValue === null ? null : unParse(initialValue),
        parse,
        isRequired: false,
        _isExpandedVariable: true
    };
};

