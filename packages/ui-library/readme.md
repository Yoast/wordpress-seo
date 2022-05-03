# Welcome to the Yoast UI Library
A React component library for building Yoast user interfaces. Please visit [the Storybook](https://ui-library.yoast.com/) for an interactive overview of all available components and examples on how to use them.

## Installation
Start with installing the package and its peer dependencies from NPM:

```shell
yarn add @yoast/ui-library @wordpress/element
```

## Setup
This package assumes the use of [`tailwindcss`](https://tailwindcss.com/) for building CSS and therefore ships with Tailwind layered CSS. You can easily setup Tailwind using the [`@yoast/tailwindcss-preset`](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/tailwindcss-preset) package.

In your `tailwind.config.js`, make sure to include this package in your `content` configuration to prevent Tailwind from purging its styles like so: 

```js
module.exports = {
    presets: [ require( "@yoast/tailwindcss-preset" ) ],
    content: [
        // Include all JS files inside the UI library in your content.
        "./node_modules/@yoast/ui-library/**/*.js",
        "./path/to/your/content/**/*.js",
    ],
};
```

To include this packages CSS in your build, import it in your stylesheet **before** the Tailwind layers like so:

```css
/* Import main CSS including all components. */
@import "@yoast/ui-library";
/**
 * Optionally import the custom base layer styles.
 * Don't use this in an environment that includes its own base layer,
 * ie. WordPress admin.
 */
@import "@yoast/ui-library/css/base.css";

/* Tailwind layers */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Now that your CSS is setup, you can start using the React components like so:

```jsx
import { Alert } from "@yoast/ui-library";

export default () => (
    <Alert variant="success">
        Congrats! You've successfully setup the UI library.
    </Alert>
);
```

## Elements, components & patterns
To improve the flexibilty and reusability of this library its split into three layers: elements, components & patterns. Each layer adds upon the preceding layer in terms of complexity and specificity. The goal of this split is to provide the most useful interfaces for regular use cases, but to remain flexibile enough to handle edge case implementations that require a different structure. If, for instance, a component or pattern turns out to be too opiniated, you can always fallback to building with elements only without having to reinvent the wheel entirely.

### Elements
The elements layer contains the simplest and stupidest components. They are the smallest building blocks. They are unopinionated, will hardly ever contain internal state and basically represent regular HTML elements with some added branding. Examples of elements are the `Button`, `Input` and `Title` components.

### Components
The components layer contains more complex and smarter components. They are probably the most used building blocks. They are a little opiniated, will sometimes contain internal state and represent regular use case components that group multiple elements together into a friendly interface. Examples of components are the `InputField` and other form field components, that provide an interface for adding labelling and error messaging to an input element.

### Patterns
The patterns layer contains the most complex and smart components. They are the largest and often structural building blocks. They are highly opiniated, will probably contain internal state and represent structures that group multiple elements and components together into a friendly interface. Examples of patterns are `PageLayout` and `Navigation` components (both undeveloped yet), that provide an interface for structuring entire pages or responsive navigation.

## The `as` property
To make components in this library as flexible as possible, most of them implement the `as` propterty pattern. The idea is simple: it allows you to render a component as every valid JSX element, so HTML elements or custom React components. It can be read in a sentence like this: "Render `ComponentA` **as** `ComponentB`". Popular examples are rendering an anchor that looks like a button, or a label that looks like a title:

```jsx
import { Button, Title } from "@yoast/ui-library";

export default () => (
    <>
        <Button as="a" href="https://yoast.com">I look like a button but am actually an achor.</Button>
        <Title as="label">I look like a title but am actually a label.</Title>
    </>
);
```

## Local development
The components in this library are developed in isolation inside a [Storybook](https://storybook.js.org/), a visual tool for building component libraries. Developing components in isolation helps keep the interfaces flexibile while ignoring implementation details.

```sh
# Install dependencies
yarn install
# Run Storybook for local development
yarn storybook
# Build a static Storybook
yarn build:storybook
```

## Contributions
If you've developed a React component that you think belongs in this library, feel free to reach out to the Components team or open a pull request and request a review from one of the Components teams developers.