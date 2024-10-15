# Installation of the Yoast related keyphrase suggestions library
To install the Yoast related keyphrase suggestions library, start with installing the package and its peer dependencies from NPM.

```shell
# Add dependencies with Yarn
yarn add @yoast/related-keyphrase-suggestions
```

## Setup
This package assumes the use of [`tailwindcss`](https://tailwindcss.com/) for building CSS and therefore ships with Tailwind layered CSS. You can easily set up Tailwind using the [`@yoast/tailwindcss-preset`](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/tailwindcss-preset) package.

In your `tailwind.config.js`, make sure to include this package in your `content` configuration to prevent Tailwind from purging its styles like so:

```js
module.exports = {
    presets: [ require( "@yoast/tailwindcss-preset" ) ],
    content: [
        // Include all JS files inside the related keyphrase suggestions library in your content.
        "./node_modules/@yoast/related-keyphrase-suggestions/**/*.js",
        "./path/to/your/content/**/*.js",
    ],
};
```

To include this packages CSS in your build, import it in your stylesheet **before** the Tailwind layers like so:

```css
/* Import main CSS including all components. */
@import "@yoast/related-keyphrase-suggestions";

/* Tailwind layers */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Now that your CSS is set up, you can start using the React components. Always start your React tree with the `Root` component, which provides a context for general options and a CSS classname for scoping this libraries CSS. Without it, components in this library will not render properly. Check out the `Root` component in [the Storybook](https://related-keyphrase-suggestions.yoast.com/?path=/docs/2-components-root--factory).

```jsx
import { Root } from "@yoast/ui-library";
import { KeyphrasesTable } from "@yoast/related-keyphrase-suggestions";

export default () => (
    <Root context={ { isRtl: false } }>
        <KeyphrasesTable data={data}>
    </Root>
);
```

Please note that the CSS scoping adds one level of CSS specificity. Therefore `@yoast/tailwindcss-preset` does the following:
1. Enables the `important` rule for all utilities.
2. Disables the Tailwind `preflight` styles (they are included in the `Root` component's CSS).
3. Configures `@tailwindcss/forms` to use the `class` strategy (they are included in the `Root` component's CSS).
