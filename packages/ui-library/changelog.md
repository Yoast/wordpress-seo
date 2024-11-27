# Changelog

## 4.1.0

Enhancements:

* Improves styling of Autocomplete disabled state. [#21321](https://github.com/Yoast/wordpress-seo/pull/21321)
* Adds a `Toast` element. [#21407](https://github.com/Yoast/wordpress-seo/pull/21407)

Bugfixes:

* Removes the 100% height styling from the Autocomplete `.yst-autocomplete__button` class. [#21323](https://github.com/Yoast/wordpress-seo/pull/21323)

## 4.0.0

Enhancements:

* Replaces peer dependency `@wordpress/element:^4.1.1` (containing `react:^17.0.2`) with `react:^18.2.0`. [#20944](https://github.com/Yoast/wordpress-seo/pull/20944)
* Now compatible with the latest two stable versions of actively maintained browsers, through the usage of browserslist config. [#20944](https://github.com/Yoast/wordpress-seo/pull/20944)
* Adds a new "extra-large" value for the `Button` property `size`, re-aligning the entire sizing scale. [#21121](https://github.com/Yoast/wordpress-seo/pull/21121)
* Changes focus styles to use outline styling for anchors, buttons and inputs. [#21121](https://github.com/Yoast/wordpress-seo/pull/21121)
* Changes border styles to use box-shadow styling for buttons and inputs. [#21121](https://github.com/Yoast/wordpress-seo/pull/21121)
* Adds support for disabled styling in `Autocomplete` component. [#21129](https://github.com/Yoast/wordpress-seo/pull/21129)
* Adds a `Tooltip` element.  [#21197](https://github.com/Yoast/wordpress-seo/pull/21197)
* Adds `reset` as valid value of `type`, in the `Button` element. [#21309](https://github.com/Yoast/wordpress-seo/pull/21309)

Bugfixes:

* Fixes a bug where the `Textarea` element did not use the `cols` default. [#20944](https://github.com/Yoast/wordpress-seo/pull/20944)
* Fixes a bug where the `TextInput` with type `date` would span 2 lines in Chrome, by removing our placeholder and icon overrides. [#21187](https://github.com/Yoast/wordpress-seo/pull/21187)
* Fixes a bug where the background of the `Autocomplete` element would not be applied to the full width of the element. [#21173](https://github.com/Yoast/wordpress-seo/pull/21173)

## 3.3.0

Enhancements:

* Adds support for readonly and disabled styling in `Textarea` component. [#21008](https://github.com/Yoast/wordpress-seo/pull/21008)
* Adds styling and placeholder to date type of `TextInput` component. [#21008](https://github.com/Yoast/wordpress-seo/pull/21008)

Bugfixes:

* Adds missing button type to the Notifications' dismiss button. [#20920](https://github.com/Yoast/wordpress-seo/pull/20920)
* Adds missing button type to the SidebarNavigation MenuItem' button. [#20920](https://github.com/Yoast/wordpress-seo/pull/20920)
* Adds missing button type to the SidebarNavigation Mobile' open and close buttons. [#20920](https://github.com/Yoast/wordpress-seo/pull/20920)
* Adds missing button type to the Autocomplete' clear selection button. [#20920](https://github.com/Yoast/wordpress-seo/pull/20920)
* Adds missing button type to the TagInput' remove tag button. [#20920](https://github.com/Yoast/wordpress-seo/pull/20920)
* Fixes a bug where a longer text for the `selectLabel` value would cause alignment issues in the `FileInput` element. [#21054](https://github.com/Yoast/wordpress-seo/pull/21054)
* Adds missing button type to the FileImport' abort button. [#20920](https://github.com/Yoast/wordpress-seo/pull/20920)

## 3.2.1

Bugfixes:

* Fixes a bug in the `FileInput` element where the `onChange` callback would sometimes retrieve an unexpected `File` instead of the intended change event. This introduces an `onDrop` callback to retrieve the drop event containing the dropped files. [#20646](https://github.com/Yoast/wordpress-seo/pull/20646)
* Fixes a bug in the `FileImport` component where drag-and-drop would not provide the uploaded file and throw an error instead. [#20646](https://github.com/Yoast/wordpress-seo/pull/20646)

## 3.2.0

Enhancements:

* Increases the z-index of the AutoSuggest component. [#20349](https://github.com/Yoast/wordpress-seo/pull/20349)
* Adds a Container to the Modal. It has a Header, Content and Footer. The Content can overflow. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Adds the `initialFocus` prop to the modal context. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Adds `className` and prop spreading to the Notifications, applying it to the internal `aside`. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Adds a Pagination component. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Changes the Notification `title` prop to be optional. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Adds a SkeletonLoader element. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Fixes a bug where the Notification `onDismiss` would not be a function by default. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Adds a `tertiary` variant to the Button. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Updates minimum `@headlessui/react` dependency from `1.7.7` to `1.7.8`. [#19759](https://github.com/Yoast/wordpress-seo/pull/19759)
* Adds Paper element. [#20359](https://github.com/Yoast/wordpress-seo/pull/20359)
* Add a clear button to nullable autocomplete field. [#20496](https://github.com/Yoast/wordpress-seo/pull/20496)

Bugfixes:

* Fixes a bug where the Notifications max width and height would not handle scrolling properly. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Fixes a bug where the Modal overlay would not handle scrolling properly. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Fixes the default color for placeholder and removed placeholder color styles from components css files. [#20433](https://github.com/Yoast/wordpress-seo/pull/20433)
* Fixes a bug where box shadow would be missing when using autocomplete field. [#20501](https://github.com/Yoast/wordpress-seo/pull/20501)
* Adds the missing dependency on `@reduxjs/toolkit` explicitly. [8a4252d](https://github.com/Yoast/wordpress-seo/commit/8a4252d6d99e09d09af6e5c2a9bfe0bdd57dcf88)

## 3.1.0

* Improves the focus style of anchors by making it more pronounced. This affects: all anchors within the `yst-root` and `yst-validation-message` classes as well as the `Link` and `SidebarNavigation.SubmenuItem` components. And lastly, the `Button` element, if rendered `as` an anchor. [#19535](https://github.com/Yoast/wordpress-seo/pull/19535)
* Removes the `TagInput` _tabindex_ override. [#19535](https://github.com/Yoast/wordpress-seo/pull/19535)
* Adds `openButtonId` and `closeButtonId` props to the _SidebarNavigation.Mobile_ component. [#19646](https://github.com/Yoast/wordpress-seo/pull/19646)
* Adds focus to radio buttons with `inline-block` variant. [#19633](https://github.com/Yoast/wordpress-seo/pull/19633)
* Notifications will now provide vertical scrolling if the content does not fit. [#19658](https://github.com/Yoast/wordpress-seo/pull/19658)
* Uses `forwardRef` for the `Modal` component to get a references of the `Dialog` DOM node, necessary to move keyboard focus on it. [#19652](https://github.com/Yoast/wordpress-seo/pull/19652)
* Increases the contrast of the `Toggle`. [#19608](https://github.com/Yoast/wordpress-seo/pull/19608)
* Adds `aria-label` support for `label` in `ToggleField` component. [#19536](https://github.com/Yoast/wordpress-seo/pull/19536)
* Improves accessibility for mobile navigation by changing style of menu open and close button, and the default screen reader text of that component. [#19604](https://github.com/Yoast/wordpress-seo/pull/19604)
* Adds the ability to use xs text format for `title` elements [#19592](https://github.com/Yoast/wordpress-seo/pull/19592)
* Exports the `useNavigationContext` hook for when you use the `SidebarNavigation`. [#19497](https://github.com/Yoast/wordpress-seo/pull/19497)
* Adds the ability to clear a tag input field by using the `ctrl + backspace` keyboard shortcut. [#19589](https://github.com/Yoast/wordpress-seo/pull/19589)

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
