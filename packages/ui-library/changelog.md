# CHANGELOG.md

## 3.0.0 (2022-12-15)

Breaking changes:
- Adds the need for the `Modal.Panel` component to be rendered inside the `Modal` [component](https://ui-library.yoast.com/?path=/docs/2-components-modal--factory) to give more control over the modal panel.
- Removes `error` and `isError` prop support on `Select` [element](https://ui-library.yoast.com/?path=/docs/1-elements-select--factory), `Autocomplete` [element](https://ui-library.yoast.com/?path=/docs/1-elements-autocomplete--factory) and all `*Field` components, ie. the `TextField` [component](https://ui-library.yoast.com/?path=/docs/2-components-text-field--factory), in favour of a more flexible `validation` prop which supports additional `info`, `warning` and `success` variants.

New components:
- Introduces the `Autocomplete` [element](https://ui-library.yoast.com/?path=/docs/1-elements-autocomplete--factory) and `AutocompleteField` [component](https://ui-library.yoast.com/?path=/docs/2-components-autocomplete-field--factory) for a queryable select interface.
- Introduces the `Card` [component](https://ui-library.yoast.com/?path=/docs/2-components-card--factory).
- Introduces the `ChildrenLimiter` [component](https://ui-library.yoast.com/?path=/docs/2-components-children-limiter--factory) for restricting and expanding its sub-component.
- Introduces the `FeatureUpsell` [component](https://ui-library.yoast.com/?path=/docs/2-components-feature-upsell--factory) for upselling features by wrapping its sub-components.
- Introduces the `Notifications` [component](https://ui-library.yoast.com/?path=/docs/2-components-notifications--factory) for displaying toast notifications.
- Introduces the `SidebarNavigation` [component](https://ui-library.yoast.com/?path=/docs/2-components-sidebar-navigation--factory) for displaying sidebar navigation with mobile support.
- Introduces the `TagInput` [element](https://ui-library.yoast.com/?path=/docs/1-elements-tag-input--factory) and `TagField` [component](https://ui-library.yoast.com/?path=/docs/2-components-tag-field--factory) for a richer interface for ie. comma separated list inputs.
- Introduces the `Code` [element](https://ui-library.yoast.com/?path=/docs/1-elements-code--factory) for displaying code snippets.
- Introduces the `ErrorBoundary` [element](https://ui-library.yoast.com/?path=/docs/1-elements-error-boundary--factory) for catching unforeseen errors in the component tree and displaying a fallback UI.
- Introduces the `FileInput` [element](https://ui-library.yoast.com/?path=/docs/1-elements-file-input--factory) for a richer interface for `type="file"` inputs.
- Introduces the `Table` [element](https://ui-library.yoast.com/?path=/docs/1-elements-table--factory).
- Introduces the `ValidationIcon` and `ValidationMessage` elements for diplaying icons and text based on a validation variant.

Other changes:
- Adds `disabled` prop support to the `CheckboxGroup` [component](https://ui-library.yoast.com/?path=/docs/2-components-checkbox-group--factory).
- Adds new `selected` and `aborted` status to the `FileImport` [component](https://ui-library.yoast.com/?path=/docs/2-components-file-import--factory).
- Adds `labelSuffix` prop support to various `*Field` components for displaying nodes next to label elements.
- Adds an export for the `VALIDATION_VARIANTS` and `VALIDATION_ICON_MAP` constants which hold supported validation variants and their associated icons.
- Adds `size` prop support to the `Badge` [element](https://ui-library.yoast.com/?path=/docs/1-elements-badge--factory).
- Adds `children`  prop support to the `Label` [element](https://ui-library.yoast.com/?path=/docs/1-elements-label--factory).
- Adds `children` prop support to the `Select` [element](https://ui-library.yoast.com/?path=/docs/1-elements-select--factory) and `Autocomplete` [element](https://ui-library.yoast.com/?path=/docs/1-elements-select--factory) for rendering options as children instead of via the `options` prop.
- Introduces various [hooks](https://ui-library.yoast.com/?path=/docs/other-exports-hooks--page).

&nbsp;

## 2.1.2 (2022)

No changelog before this version.