# Installation of the Yoast related keyphrase suggestions library
To install the Yoast related keyphrase suggestions library, start with installing the package and its peer dependencies from NPM.

```shell
# Add dependencies with Yarn
yarn add @yoast/related-keyphrase-suggestions @yoast/ui-library
```

## Setup

```jsx
import { Root } from "@yoast/ui-library";
import { KeyphrasesTable } from "@yoast/related-keyphrase-suggestions";

export default () => (
    <Root context={ { isRtl: false } }>
        <KeyphrasesTable data={data}>
    </Root>
);
```