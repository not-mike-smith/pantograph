

type StateType = Readonly<{
	x: number,
	y: string,
	z: string
}>;

interface IExpandedVariable<T> {
	readonly value: null | T;
	readonly textValue: null | string;
	readonly isRequired: boolean;
	readonly _isExpandedVariable: true;
}

type RequiredVariable<T> = {
	readonly value: null | T,
	readonly textValue: null | string,
	readonly isRequired: true,
	readonly _isExpandedVariable: true
};

type OptionalVariable<T> = {
	readonly value: null | T,
	readonly textValue: null | string,
	readonly isRequired: false,
	readonly _isExpandedVariable: true
};

type ProtoStateType = {
	x: IExpandedVariable<number>,
	y: IExpandedVariable<string>
};

const required = <T>(initialValue: null | T = null): RequiredVariable<T> => {
	return {
		value: initialValue,
		isRequired: true
	};
};

const optional = <T>(initialValue: null | T = null): OptionalVariable<T> => {
	return {
		value: initialValue,
		isRequired: false
	};
};

const hasAllRequiredFields = (prototype: any) => {
	Object.keys(prototype).some(fieldKey => {
		const variable = prototype[fieldKey] as IExpandedVariable<{}>;
		return variable.isRequired &&
			(variable.value === null || variable.value === undefined);
	});
};

const defaultProtoType = {
	x: required(0),
	y: optional<string>()
};

const toPartialObject = <T>(prototype: Expanded<T>): T => {
	return Object.keys(prototype).reduce(
		(flattenedObj, fieldKey) => {
			flattenedObj[fieldKey] = prototype[fieldKey].value;
			return flattenedObj;
		},
		{}) as T;
};

type Expanded<T> = {
	readonly [P in keyof T]: null extends T[P] ? OptionalVariable<T[P]> : RequiredVariable<T[P]>
}

type Foo = {
	x: number,
	y: null | boolean,
};

type Bar = Expanded<Foo>;

const foo: Foo = {
	x: 0, y: null
};
