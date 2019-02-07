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

    export type Expanded<T> = {
        readonly [P in keyof T]: null extends T[P] ? OptionalVariable<T[P]> : RequiredVariable<T[P]>
    };
}