# Redirects UI
The redirects UI is a React app that is initialised in `./initialize.js`.
It introduces a few new libraries and concepts:

## Libraries

### UI library
[The Yoast UI library](https://ui-library.yoast.com/) is used as much as possible. Components located in `redirects/components` should be considered WordPress specific.

### Redux Toolkit
The Redux store is powered by [Redux Toolkit](https://redux-toolkit.js.org/). It features handy helpers to help with the boilerplate of writing actions, reducers and selectors. It integrates mostly with `@wordpress/data`.

### Formik
Form state is managed entirely through [Formik](https://formik.org/). It features a series of hooks and HOCs to connect UI library components to form state in the Formik context.

#### Validation
Formik allows for [Yup](https://github.com/jquense/yup) schema based validation. See [the Formik validation guides](https://formik.org/docs/guides/validation) also. Invalid validation will block a user from saving their settings. The validation schema can be found in `./helpers/validation.js`.

### Shadow DOM for legacy `styled-components`
In `./initialize.js` we create a [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) in which we load all legacy `styled-components` styles. This way these styles will not affect the primary DOM and that allows us to start with a clean CSS slate in the new UI.

### Error boundary
The main content is wrapped in [a React error boundary](https://reactjs.org/docs/error-boundaries.html). It will catch all unforeseen JavaScript errors in the component tree and show a fallback UI.
