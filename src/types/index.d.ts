export as namespace pantograph;
export = pantograph;

declare namespace pantograph {
    export interface IExpandedVariable<T> {
        readonly value: null | T;
        readonly textValue: null | string;
        readonly parse: (textValue: string) => null | T;
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

    export function hasAllRequiredFields<T>(expandedObject: Expanded<T>): boolean;

    export function createExpanderFunction<T>(fcnsHolder: any): (obj: T) => Expanded<T>;

    export function condense<T>(expandedObj: Expanded<T>): T;

    export function required<T>(
        parse: (textValue: string) => null | T,
        unparse: (value: T) => string,
        initialValue: null | T
    ): RequiredVariable<T>;

    export function expandRequired<T>(
        parse: (textValue: string) => null | T,
        unparse: (value: T) => string
    ): (initialValue: null | T) => RequiredVariable<T>;

    export function optional<T>(
        parse: (textValue: string) => null | T,
        unparse: (value: T) => string,
        initialValue: null | T
    ): OptionalVariable<T>;

    export function expandOptional<T>(
        parse: (textValue: string) => null | T,
        unparse: (value: T) => string
    ): (initialValue: null | T) => OptionalVariable<T>;

    export function requiredString(initialValue: null | string): RequiredVariable<string>;
    export function optionalString(initialValue: null | string): OptionalVariable<string>;

    export function requiredInt(initialValue: null | number): RequiredVariable<number>;
    export function optionalInt(initialValue: null | number): OptionalVariable<number>;

    export function requiredFloat(initialValue: null | number): RequiredVariable<number>;
    export function optionalFloat(initialValue: null | number): OptionalVariable<number>;

    export function requiredYesNo(initialValue: null | boolean): RequiredVariable<boolean>;
    export function optionalYesNo(initialValue: null | boolean): OptionalVariable<boolean>;
}