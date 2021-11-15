# Replacement variables

This package aims to provide the easiest possible solution for replacing variables in a text based on a set of replacement variables. It exposes a single factory function `createReplacementVariables` for configuring a set of replacement variables and returns an interface for applying these replacement variables to a text.

## Installation

To install this package run the following command in your terminal:

```shell
yarn add @yoast/replacement-variables
```

## Configuration

The `createReplacementVariables` factory accepts a single argument: an array of replacement variable configurations with the following props:

**`name`** `String`\
The `snake_case` name of the replacement variable.

**`label`** `String`\
The label of the replacement variable to display in UI.

**`getReplacement`** `Function` \
A pure function that returns the replacement for the replacement variable. The function can accept arguments and must return a string.

**`regexp`** `RegExp` - *Optional*\
Optional custom Regular Expression for locating the variable in a string. Defaults to `%%name%%`.

### Example

An example configuration may look like this:

```js
import createReplacementVariables from "@yoast/replacement-variables";

const configurations = [
    {
        name: "title",
        label: "Title",
        getReplacement: () => "Replaced title",
    },
    {
        name: "global_variable",
        label: "Global Variable",
        getReplacement: ( key ) => window[ key ], // getReplacement accepts one argument
    },
    {
        name: "redux_store_state",
        label: "Redux Store State",
        getReplacement: () => selectFromReduxStore( "path.in.state" ),
        regexp: new RegExp( `{{${ name }}}`, "g" ), // Using Handlebars style template tags
    },
];

const replacementVariables = createReplacementVariables( configurations );
```

## Usage


### Example

```js
import createReplacementVariables from "@yoast/replacement-variables";

const replacementVariables = [
    {
        name: "title",
        getReplacement: () => "Replaced title",
    },
    {
        name: "global_variable",
        getReplacement: () => window.variable,
    },
    {
        name: "store_state",
        getReplacement: () => selectFromReduxStore( "path.in.state" ),
    },
];

console.log(  );
```

