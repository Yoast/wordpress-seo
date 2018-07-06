# Yoast components

React components for use within different Yoast React projects.

## Installation

You can install yoast-components using npm:

```bash
npm install yoast-components
```

## Usage

```js
import Input from 'yoast-components/forms/Input'

// Then you can use the Input component within your React components
```

## Requirements

### React intl

Components that are translated using `react-intl` require that you wrap your application in `react-intl`'s `IntlProvider`.

See [the documentation](https://github.com/yahoo/react-intl) for more information.

### Webpack

If you use `yoast-components` within your own project we recommend using `webpack` with the following loaders and configuration:

* Babel-loader
  * Presets: es2015 and react
  
#### Example

Webpack 2+ configuration:
```js
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [ {
                    loader: "babel-loader",
                } ],
            },
            // ...
        ],
    },
    // ...
}
```
`.babelrc`:
```json
{
  "presets": ["es2015", "react"]
}
```
  
### Additional configuration

In the `entry` of your webpack you should include [babel-polyfill](https://babeljs.io/docs/usage/polyfill/#usage-in-node-browserify-webpack) as the very first element:

```js
module.exports = {
    // ...
    entry: [
        "babel-polyfill",
        // ...
        "your-app-entry.js"
    ]
    // ...
}
```

### Reducers and Middleware

Some components require implementing a reducer. See which components need what reducers below:

#### Content analysis

If you wish to use the content analysis component you should implement the `contentAnalysisReducer`, located in `yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer.js`. In your root reducer this reducer should have the name `contentAnalysis`.
```js
import contentAnalysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer.js";
// Your root reducer
combineReducers( {
    // ...
    contentAnalysis: contentAnalysis,
    // ...
} );
```

## Setup
- Run a `yarn install` in the root folder.
- Run `yarn start` in the root folder.
- Go to `http://localhost:3333`

## Testing

```bash
yarn test
```

## Code style

To test the code style:

```bash
grunt check
```

## Contributing

### Folder structure

Every component should have its own folder named lowercase with the relevant files inside of it. Every component must contain a JavaScript with the component definition in it and exported using `export default [Component]`. Any component can contain a SCSS file for relevant CSS and a README.md explaining how the component works.

### Translation

We use [i18n-calypso](https://github.com/Automattic/i18n-calypso) to localize all components. Refer to their documentation about how to use `translate`, `moment` and `numberFormat`. We don't use the mixin provided. Only use the higher order component to wrap components when they are exported, like so:

```js
import { localize } from 'i18n-calypso'

export default localize( Component );
```

## Security

If you discover any security related issues, please email security [at] yoast.com instead of using the issue tracker.

## Credits

- [Team Yoast](https://github.com/orgs/Yoast/people)
- [All Contributors](https://github.com/Yoast/yoast-components/graphs/contributors)

## License

We follow the GPL. Please see [License](LICENSE) file for more information.

## Developing within `wordpress-seo`<sup>1</sup>
<sup>1. With some minor tweaks this can also be used to develop yoast-components within other projects</sup>

If you would like to develop `yoast-components` within the `wordpress-seo` plugin, you can do this quite easily using [`yarn`](https://yarnpkg.com/lang/en/).

1. Link your `yoast-components` project to `wordpress-seo` using the command line:
    1. In your `yoast-components` project run `yarn link`.
    2. In your `wordpress-seo` project run `yarn link "yoast-components"`.

Now you can make development easier by having `grunt` watch your files:
1. In `wordpress-seo` open `Gruntfile.js`.
2. Within the configuration object `project`, add the following line to `paths>files>js[]`:
    `node_modules/yoast-components/**/*.js`
3. Run `grunt watch`
