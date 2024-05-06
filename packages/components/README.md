## Deprecated
We have not released changes in this package since May 18, 2021. And are not planning to do so in the future.
We are not actively maintaining this package for a while now and are using the `@yoast/ui-library` package in our newer projects.
The package will remain available in its current state on NPM, but will be marked as deprecated.
The package will remain available in this repo on GitHub, until we ourselves are no longer using it.

## Requirements
The Yoast/Components package is not pre-build. So if you would like to include `@yoast/components` into your project we will need a few steps to set it up.

### Loading Javascript.

1. Install the package by running `yarn add @yoast/components`.
2. Include Yoast/components into the babel-loader of your `webpack.config`. This will look something like this: `include: [ paths.appSrc, /node_modules[/\\](@yoast)[/\\].*/ ]`
3. It can be that you will need presets for the `babel-loader`. These are: `presets: [ "@babel/preset-env", "@babel/preset-react" ]`

	Note that you will also need to install these presets. Run `yarn add --dev @babel/preset-env @babel/preset-react`

### Loading CSS

Because we are importing CSS in our JavaScript, your JavaScript bundler needs to be able to interpret CSS.

Therefore, you will need to use a css-loader in your bundler in order to use this package.

E.g. in Webpack: https://webpack.js.org/loaders/css-loader/

Make sure to add the CSS imports to your project. `import "@yoast/components/base";` This is a collection of all the CSS in `@yoast/components`.
It should be imported in App.js or index.js of your react project.

## Using the MultiSelect
The `MultiSelect` component requires the presence of both [jQuery](https://jquery.com/download/) and [Select2](https://select2.org/getting-started/installation). Make sure that they are available on the global window object before the component is instantiated.

If you are working in a WordPress environment, WordPress will automatically load jQuery for you so you only need to worry about Select2.
