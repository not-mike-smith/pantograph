export const hasAllRequiredFields = (expandedObject) => {
    !Object.keys(expandedObject).some(fieldKey => {
        const variable = expandedObject[fieldKey];
        return variable._isExpandedVariable &&
            variable.isRequired &&
            (variable.value === null || variable.value === undefined);
    });
};

export const createExpanderFunction = (expanderObj) => {
    return (condensedObj) => {
        return Object.keys(expanderObj).reduce(
            (expandedObj, currentName) => {
                const variableExpander = expanderObj[currentName];
                expandedObj[currentName] = variableExpander(condensedObj[currentName])
                return expandedObj;
            },
            {});
    };
};

export const condense = (expandedObj) => {
    return Object.keys(expandedObj).reduce(
        (condensedObj, currentName) => {
            const expandedVar = expandedObj[currentName];
            if (!expandedVar._isExpandedVariable) return condensedObj;

            condensedObj[currentName] = expandedVar.textValue === null
                ? null
                : expandedVar.parse(expandedVar.textValue);

            return condensedObj;
        },
        {}
    );
};

export const required = /*<T>*/(
    parse, //: (textValue: string) => null | T,
    unparse, //: (value: T) => string,
    initialValue, //: null | T = null,
)/*: p.RequiredVariable<T>*/ => {
    return {
        value: initialValue,
        textValue: initialValue === null ? null : unparse(initialValue),
        parse,
        isRequired: true,
        _isExpandedVariable: true
    };
};

const expandRequired = (parse, unparse) => {
    return (initialValue) => {
        return required(parse, unparse, initialValue);
    };
};

export const optional = /*<T>*/(
    parse, //: (textValue: string) => null | T,
    unparse, //: (value: T) => string,
    initialValue, //: null | T = null,
)/*: p.OptionalVariable<T>*/ => {
    return {
        value: initialValue,
        textValue: initialValue === null ? null : unparse(initialValue),
        parse,
        isRequired: false,
        _isExpandedVariable: true
    };
};

const expandOptional = (parse, unparse) => {
    return (initialValue = null) => {
        return optional(parse, unparse, initialValue);
    };
};

const passThrough = (s) => s;

export const requiredString = expandRequired(passThrough, passThrough);

export const optionalString = expandOptional(passThrough, passThrough);

const parseIntOrNull = (s) => {
    const i = parseInt(s);
    if (isNaN(i)) return null;

    return i;
};

export const requiredInt = expandRequired(parseIntOrNull, int => int.toString());

export const optionalInt = expandOptional(parseIntOrNull, int => int.toString());

const parseFloatOrNull = (s) => {
    const f = parseFloat(s);
    if (isNaN(f)) return null;

    return f;
};

export const requiredFloat = expandRequired(parseFloatOrNull, f => f.toString());

export const optionalFloat = expandOptional(parseFloatOrNull, f => f.toString());

const parseYesNo = (yesNo) => {
    const yn = yesNo.toLowerCase();
    if (yn === "yes" || yn === "y") return true;
    if (yn === "no" || yn === "n") return false;

    return null;
}

const unparseYesNo = (b) => b ? "Yes" : "No";

export const requiredYesNo = expandRequired(parseYesNo, unparseYesNo);

export const optionalYesNo = expandOptional(parseYesNo, unparseYesNo);
