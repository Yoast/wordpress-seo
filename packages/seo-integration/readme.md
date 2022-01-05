# `@yoast/seo-integration`

This package aims to provide a simple solution for integrating an editor with Yoast. It should be the **only** package you need for integrating an editor with the Yoast SEO and readability analysis. In the future, this package will include all available Yoast features and replace all other ways of integrating Yoast.

`@yoast/seo-integration` combines the functionality of `@yoast/replacement-variables` and `@yoast/seo-store` into a single interface. It  currently does four things that every editor integration with Yoast has to account for:

1. Create an analysis worker that can analyze papers.
2. Manage analysis paper and Yoast form data in a Redux store.
3. Triggers new analyses whenever this data changes.
4. Applies replacement variables to paper data before it is sent to the worker for analysis.

## Installation & building

To install this package run the following command in your terminal:

```sh
yarn add @yoast/seo-integration
# For local development
yarn link @yoast/seo-integration
```

This package is built with Babel. To build this package run the following command in your terminal:

```sh
yarn build
# For local development
yarn watch
```

## Using `createSeoIntegration`

The package is built around a single `createSeoIntegration` factory which accepts a configuration and returns tools for easily integrating an editor with Yoast SEO.


### Arguments
The factory accepts a single `configuration` object argument with the following props:

**`analysis`** `Object`\
Analysis related configuration object with the following props:

- **`workerUrl`** `String`\
Url to the analysis worker.

- **`dependencies`** `Object`\
Dependencies to load in the worker.

- **`configuration`** `Object`\
Valid analysis worker configuration object.

- **`types`** `Object`\
Analysis types keyed by name with the following props:

  - **`name`** `String`\
  The name of the analysis type, for example: "post".

  - **`replacementVariableConfigurations`** `Object[]`\
  Array of replacement variable configurations for this analysis type. Please see the docs of `@yoast/replacement-variables` for what replacement variable configurations look like.

**`initialState`** `Object`\
Initial Redux store state. Please see the docs of `@yoast/seo-store` for what the state object should look like.


### Return
The factory returns an object with the following props:

**`analysisWorker`** `Object`\
The analaysis worker interface.

**`SeoProvider`** `Component`\
A context provider component for rendering the `SeoContext` into a React tree. You can access the context using the `useSeoContext` hook also exported from from this package. The `SeoContext` contains the following props:

- **`analysisTypeReplacementVariables`** `Object`\
An object keyed by analysis type that contains replacement variables for that analysis type. Please see the docs of `@yoast/replacement-variables` for what a replacement variable object looks like.
```js
// analysisTypeReplacementVariables
{
    post: { ...replacementVariables },
    term: { ...replacementVariables },
}
```

### Example usage

Please note that the implementor is responsible for updating the correct fields in the Redux store whenever editor data changes. This "watcher" concept is illustrated on the last lines of below example integration.

```js
const { SeoProvider, analysisWorker } = createSeoIntegration( {
    analysis: {
        workerUrl: "url-to-worker.example",
		dependencies: {
            lodash: "url-to-lodash.example",
        },
		types: {
			post: {
				name: "post",
				replacementVariableConfigurations: [
                    {
                        name: "var_name",
                        label: "Variable Name",
                        getReplacement: () => "Replacement",
                    }
                ],
			},
		},
		configuration: {
			locale: "en_US",
		},
    },
    initialState: {
        editor: {
            title: "title from DOM",
            content: "content from DOM",
        }
    }
} );

// Do something custom with the analysis worker.
analysisWorker.sendMessage( "Do something custom" );
// Render the UI wrapped in the SeoProvider.
ReactDOM.render(
    <SeoProvider>
        <App/>
    </SeoProvider>
    document.getElementById( "root" ),
);
// Sync editor changes to the store, causing a new analyses to trigger. We call this a "watcher".
const actions = dispatch( SEO_STORE_NAME );
document.getElementById( "content" ).on( "change", ( event ) => actions.updateContent( event.target.value ) );
```

## Other exports

**`SEO_STORE_NAME`** `String`\
Name of the SEO Redux store. Use it along with `dispatch` and `select` from `@wordpress/data` to get access to the available `actions` and `selectors` in the store.

```js
const actions = dispatch( SEO_STORE_NAME );
const selectors = select( SEO_STORE_NAME );
```

**`FOCUS_KEYPHRASE_ID`** `String`\
Identifier of the focus keyphrase. Use it when working with the focus keyphrase, instead of using the string "focus" directly.

**`useAnalysis`** `Function`\
React hook to enable the analysis. When this hook is in a renderd component, the Redux store will start requesting analyses based on changes to the editor data in store.

```js
const Component = ( { children } ) => {
    useAnalysis();
    return children;
};
```

**`useSeoContext`** `Function`\
React hook to get the current `SeoContext` value. Use it along with the `SeoProvider` component returned by `createSeoIntegration` to access replacement variables and other useful SEO integration context in your React components.

```js
const Component = ( { children } ) => {
    const { analysisTypeReplacementVariables } = useSeoContext();
    return children;
};
```

**`ReadabilityResultsContainer`** `Function`\
Container component that connects its `as` prop Component to relevant readability results data in the store. The container will provide its component with all analysis results props needed, so the actual implementation can be very simple:
```js
<ReadabilityResultsContainer as={ ContentAnalysis } />
```

**`SeoResultsContainer`** `Function`\
Container component that connects its `as` prop Component to relevant SEO results data in the store. See `ReadabilityResultsContainer` for a similair example implementation.

**`GooglePreviewContainer`** `Function`\
Container component that connects its `as` prop Component to SEO form data in the store. See `ReadabilityResultsContainer` for a similair example implementation.

**`replacementVariableConfigurations`** `Object`\
Object of default replacement variables from the SEO store. Includes replacement variable configurations for: `title`, `content`, `excerpt`, `permalink` and `focusKeyphrase`.

## Available filters
This package provide some `@wordpress/hooks` filters for extending its functionality:

**`yoast.seoIntegration.analysis.configuration`** `Filter`\
Filters the analysis worker configuration. Functinos registered here accept the unfiltered analysis configuration and must return a valid analysis worker configuration.

**`yoast.seoIntegration.replacementVariables.configurations`** `Filter`\
Filters the replacement variable confiugrations. Use it for adding or modifying replacement variables. Functions registered here accept the unfiltered replacement variable configurations and  must return valid replacement variable configurations.

```js
addFilter(
    "yoast.seoIntegration.replacementVariables.configurations",
    "removePostReplacementVariableConfigurations", // Filter id
    ( replacementVariableConfigurations ) => ( {
        ...replacementVariableConfigurations,
        post: [],
    } ),
    10, // Filter order
);
```

**`yoast.seoIntegration.replacementVariables.${ analysisType }.configurations`** `Filter`\
Filters replacement variable configurations for a single analysis type. Functions registered here accept the unfiltered replacement variable configurations and  must return valid replacement variable configurations.

```js
// Same functionality as example above, but with analysis type specific filter.
addFilter(
    "yoast.seoIntegration.replacementVariables.post.configurations",
    "removePostReplacementVariableConfigurations",
    ( replacementVariableConfigurations ) => [],
    10,
);
```

**The `@yoast/seo-store` package provides a filter for adding/modifying paper data, please reference this imporant filter there.**