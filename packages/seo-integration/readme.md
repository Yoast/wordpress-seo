# SEO Integration

This package aims to provide a simple solution for integrating an editor with Yoast SEO. 

## Installation

To install this package run the following command in your terminal:

```sh
# Yarn
yarn add @yoast/seo-integration

# NPM
npm install @yoast/seo-integration
```

## Using `createSeoIntegration`

This package is built around a single `createSeoIntegration` factory which accepts an analysis configuration and returns tools for easily integrating an editor with Yoast SEO. Under the hood, `createSeoIntegration` spins up an analysis worker, registers a WordPress data store for SEO data, and applies replacement variables.

The factory accepts a single `configuration` object argument with the following props:

**`analysis`** `Object`\

- **`workerUrl`** `String`\
Url to the analysis webworker.

- **`dependencies`** `Object[]`\
Dependencies.

- **`configuration`** `Object`\
Valid analysis worker configuration.

- **`types`** `Object`\


## Other exports

**`SEO_STORE_NAME`** `String`\
Name of the SEO Redux store. Use it along with `dispatch` and `select` from `@wordpress/data` 

**`FOCUS_KEYPHRASE_ID`** `String`\
Identifier of the focus keyphrase.

**`useAnalysis`** `Function`\
React hook to enable the analysis. When this hook is in a renderd component, the Redux store will start requesting analyses based on changes 

**`useSeoContext`** `Function`\
React hook to get the current `SeoContext` value. Use it along with the `SeoProvider` component returned by `createSeoIntegration` to access replacement variables and other useful SEO integration context in your React components.

```js
const Component = ( { children } ) => {
    const { replacementVariables } = useSeoContext();
    return children;
};
```

**`ReadabilityResultsContainer`** `Function`\
Container component that connects its `as` prop Component to relevant readability results data in the store.
```js
<ReadabilityResultsContainer as={ ContentAnalysis } />
```

**`SeoResultsContainer`** `Function`\
Container component that connects its `as` prop Component to relevant SEO results data in the store.

**`GooglePreviewContainer`** `Function`\
Container component that connects its `as` prop Component to SEO form data in the store.

**`replacementVariableConfigurations`** `Object`\
Object of standard replacement variables from the SEO store.

## Available filters