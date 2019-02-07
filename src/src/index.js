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

const condense = (expandedObj) => {
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