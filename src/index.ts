
interface IExpandedVariable {
	readonly value: any;
	readonly textValue: null | string;
	readonly parse: (textValue: string) => any;
	readonly isRequired: boolean;
	readonly _isExpandedVariable: true;
}

export type RequiredVariable<T> = {
	readonly value: null | T,
	readonly textValue: null | string,
	readonly parse: (textValue: string) => null | T,
	readonly isRequired: true,
	readonly _isExpandedVariable: true
};

export type OptionalVariable<T> = {
	readonly value: null | T,
	readonly textValue: null | string,
	readonly parse: (textValue: string) => null | T,
	readonly isRequired: false,
	readonly _isExpandedVariable: true
};

export type ExpandedVariable<T> = OptionalVariable<T> & RequiredVariable<T>;

export type Expanded<T> = {
	readonly [P in keyof T]: null extends T[P] ? OptionalVariable<T[P]> : RequiredVariable<T[P]>
};

export const hasAllRequiredFields = <T>(expandedObject: Expanded<T>): boolean => {
	return !Object.keys(expandedObject).some(fieldKey => {
		const variable = expandedObject[fieldKey] as IExpandedVariable;
		return variable._isExpandedVariable &&
			variable.isRequired &&
			(variable.value === null || variable.value === undefined);
	});
};

export const createExpanderFunction = <T>(fcnsHolder: any): (obj: T) => Expanded<T> => {
	return (condensedObj: T): Expanded<T> => {
		return Object.keys(fcnsHolder).reduce(
			(expandedObj: any, currentName: string) => {
				const variableExpander = fcnsHolder[currentName] as (value: any) => IExpandedVariable;
				expandedObj[currentName] = variableExpander(condensedObj[currentName])

				return expandedObj;
			},
			{}) as Expanded<T>;
	};
};

export const condense = <T>(expandedObj: Expanded<T>): T => {
	return Object.keys(expandedObj).reduce(
		(condensedObj: Partial<T>, currentName: string): Partial<T> => {
			const expandedVar = expandedObj[currentName] as IExpandedVariable;
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
): RequiredVariable<T> => {
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
): OptionalVariable<T> => {
	return {
		value: initialValue,
		textValue: initialValue === null ? null : unparse(initialValue),
		parse,
		isRequired: false,
		_isExpandedVariable: true
	};
};

export const expandRequired = <T>(
	parse: (textValue: string) => null | T,
	unparse: (value: T) => string
): (initialValue: null | T) => RequiredVariable<T> => {
	return (initialValue: null | T = null): RequiredVariable<T> => {
		return required(parse, unparse, initialValue);
	};
};

export const expandOptional = <T>(
	parse: (textValue: string) => null | T,
	unparse: (value: T) => string
): (initialValue: null | T) => OptionalVariable<T> => {
	return (initialValue: null | T = null): OptionalVariable<T> => {
		return optional(parse, unparse, initialValue);
	};
};

const stringIdentity = (s: string) => s;

export const requiredString = expandRequired<string>(stringIdentity, stringIdentity);

export const optionalString = expandOptional<string>(stringIdentity, stringIdentity);

const parseIntOrNull = (s: string): null | number => {
	const i = parseInt(s);
	if (isNaN(i)) return null;

	return i;
};

export const requiredInt = expandRequired<number>(parseIntOrNull, int => int.toString());

export const optionalInt = expandOptional<number>(parseIntOrNull, int => int.toString());

const parseFloatOrNull = (s: string): null | number => {
	const f = parseFloat(s);
	if (isNaN(f)) return null;

	return f;
};

export const requiredFloat = expandRequired<number>(parseFloatOrNull, f => f.toString());

export const optionalFloat = expandOptional<number>(parseFloatOrNull, f => f.toString());

const parseYesNo = (yesNo: string): null | boolean => {
	const yn = yesNo.toLowerCase();
	if (yn === "yes" || yn === "y") return true;
	if (yn === "no" || yn === "n") return false;

	return null;
}

const unparseYesNo = (b: boolean) => b ? "Yes" : "No";

export const requiredYesNo = expandRequired<boolean>(parseYesNo, unparseYesNo);

export const optionalYesNo = expandOptional<boolean>(parseYesNo, unparseYesNo);
