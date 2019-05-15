import * as p from "./index";

type Foo = {
    x: string,
    y: boolean,
    z: null | boolean,
};

type ExpandedFoo = p.Expanded<Foo>;

const foo: Foo = {
    x: "x",
    y: false,
    z: null
};

const fooExpander = p.createExpanderFunction({
        x: p.requiredString,
        y: p.requiredYesNo,
        z: p.optionalYesNo
    });

const bar = fooExpander(foo);