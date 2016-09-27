# Yoast components

React components for use within different Yoast React projects.

## Installation

You can install yoast-components using npm:

```bash
npm install yoast-components
```

## Usage

```js
import 'Input' from 'yoast-components/forms/Input'

// Then you can Input in your React components
```

## Testing

```bash
npm test
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
