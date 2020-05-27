## Requirements
Because we are importing CSS in our JavaScript, your JavaScript bundler needs to be able to interpret CSS.  

Therefore, you will need to use a css-loader in your bundler in order to use this package.

E.g. in Webpack: https://webpack.js.org/loaders/css-loader/

## Using the MultiSelect
The `MultiSelect` component requires the presence of both [jQuery](https://jquery.com/download/) and [Select2](https://select2.org/getting-started/installation). Make sure that they are available on the global window object before the component is instantiated.

If you are working in a WordPress environment, WordPress will automatically load jQuery for you so you only need to worry about Select2.
