# Settings UI

The settings UI is a React app that is initialised in `./initialize.js`, which is enqueued into WP admin by the `~/src/integrations/settings-integration.php`.
It introduces a few new libraries and concepts:

## Libraries

### UI library
[The Yoast UI library](https://ui-library.yoast.com/) is used as much as possible. Components located in `settings/components` should be considered WordPress specific.

### Redux Toolkit
The Redux store is powered by [Redux Toolkit](https://redux-toolkit.js.org/). It features handy helpers to help with the boilerplate of writing actions, reducers and selectors. It integrates mostly with `@wordpress/data`.

### Formik
Form state is managed entirely through [Formik](https://formik.org/). It features a series of hooks and HOCs to connect UI library components to form state in the Formik context.

#### Validation
Formik allows for [Yup](https://github.com/jquense/yup) schema based validation. See [the Formik validation guides](https://formik.org/docs/guides/validation) also. Invalid validation will block a user from saving their settings. The validation schema can be found in `./helpers/validation.js`.

## Concepts

### Post requests
The main **settings** are posted to the `options.php` WordPress page, where they are picked up by our options framework for back-end validation. Ideally, this would be refactored to be a custom endpoint once the options framework refactor is completed.

The **social profiles** are posted to the `/yoast/v1/configuration/person_social_profiles` REST endpoint. Ideally, this endpoint would be refactored to be in a more general scope.

### Search
The search functionality is based on a manual index located in `./helpers/search.js`, meaning it should be manually kept in sync with changes to form fields. The structure of a search index entry is located below, the search algorithm searches through `routeLabel`, `fieldLabel` and additional `keywords`.

```js
{
    route: "/route", // The route on which the field is location.
    routeLabel: "Route Label", // The route label as appears in the search results.
    fieldId: "field-id", // The field ID is used for locating and focussing the field when search item is clicked.
    fieldLabel: "", // The field label as appears in the search results.
    keywords: [ "one", "two" ], // Additional search keywords.
}
```

### Media preloading
Media files are preloaded in `./initialize.js` so they can be checked in initial form validation and can be displayed immediately after a route with media renders.

### Shadow DOM for legacy `styled-components`
In `./initialize.js` we create a [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) in which we load all legacy `styled-components` styles. This way these styles will not affect the primary DOM and that allows us to start with a clean CSS slate in the new UI.

### Error boundary
The main content is wrapped in [a React error boundary](https://reactjs.org/docs/error-boundaries.html). It will catch all unforeseen JavaScript errors in the component tree and show a fallback UI.