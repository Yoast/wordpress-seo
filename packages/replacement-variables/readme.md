# Replacement Variables

This package aims to provide a simple solution for replacing *variables* with their corresponding *values* in a text based on a set of *replacement variables*. Use this package to configure what variables are supported and how these should be replaced when the variable is encountered in a text.

## Installation

To install this package run the following command in your terminal:

```sh
# Yarn
yarn add @yoast/replacement-variables

# NPM
npm install @yoast/replacement-variables
```

## Using `createReplacementVariables`

This package exports a single factory function called `createReplacementVariables` which accepts an array of replacement variable configuratinos and return an interface for applying the variables to a text.

### Arguments

**`configurations`** `Object[]`\
An array of replacement variable configurations containing the following props:

- **`name`** `String`\
The name of the replacement variable. The convention here is to use `snake_case` naming.

- **`label`** `String`\
The label of the replacement variable to display in user interface if needed.

- **`getReplacement`** `Function`\
A pure function that returns the replacement value for the variable. The function can accept a single **`context`** `Object` argument and must return a `String`. This function can get data from anyhwere, ie. a Redux store selector, a global variable or just a static string.

- **`regexp`** `RegExp` - *Optional*\
Optional custom Regular Expression for locating the variable in a string. Defaults to `%%name%%`.

### Returns

**`replacementVariables`** `Object`\
An interface for applying replacement variables to a text containing the following props:

- **`variables`** `Object[]`\
An array of enriched replacement variables. The difference from the variables passed as an argument is that, if not specified specifically, the `regexp` prop has been added to each variable for locating the variable in a string. The template tag used in the default `regexp` is based on the variables `name` prop and looks like this: `%%name%%` (surrounding the `name` with double percent chars).

- **`apply`** `Function`\
A function that accepts a `String` and returns a `String` in which all supported variables have been replaced with their corresponding values. An *optional* second **`context`** `Object` argument is supported, which will be passed as the first and only argument to all `getReplacement` functions in the configured set of replacement variables.

## Example implementation

In this example we'll configure a set of three replacement variables and apply them to three example strings to demonstrate the flexibility of the variables `getReplacement` function.

```js
import createReplacementVariables from "@yoast/replacement-variables";

// Some state
window.fooBar = "Foo Bar";
const selectFromReduxStore = () => "State from Redux Store";

const configurations = [
    {
        name: "title",
        label: "Title",
        getReplacement: () => "Title",
    },
    {
        name: "global_variable",
        label: "Global Variable",
        // getReplacement with context
        getReplacement: ( context ) => window[ context.globalKey ],
    },
    {
        name: "redux_store_state",
        label: "Redux Store State",
        getReplacement: () => selectFromReduxStore(),
        // Using a custom template tag
        regexp: new RegExp( `{{custom_template_tag}}`, "g" ),
    },
];

const replacementVariables = createReplacementVariables( configurations );

const string1 = "There is no %%title%% without %%global_variable%%";
const string2 = "There is no %%title%% without %%redux_store_state%%";
const string3 = "There is no {{title}} without {{custom_template_tag}}";

console.log(
    replacementVariables.apply( string1 ),
    replacementVariables.apply( string1, { globalKey: "fooBar" } ),
    replacementVariables.apply( string2 ),
    replacementVariables.apply( string3 ),
);

// Expected Output
// ---
// "There is no Title without undefined"
// "There is no Title without Foo Bar"
// "There is no Title without %%redux_store_state%%"
// "There is no {{title}} without State from Redux Store"
```
