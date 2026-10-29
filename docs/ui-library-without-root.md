# Markup without a `.yst-root` ancestor

Since the ui-library stopped scoping its component CSS to `.yst-root` (#23047), its components render correctly without a `Root` ancestor. Plain markup does not: the base styles (font, text color, line-height) and the Tailwind preflight resets are still scoped to `.yst-root`. Outside it, WordPress admin, Gutenberg and Elementor CSS apply instead.

Follow these rules for markup in `packages/js` that can render outside a `Root`, for example inside the block editor sidebar, the metabox, the Elementor panel, or a page without a top-level `Root`.

## Base styles

Put the inherited base on the outermost element of the component, where a `yst-root` wrapper used to be:

```
yst-text-sm yst-font-normal yst-font-sans yst-text-slate-600 yst-leading-normal yst-antialiased
```

## Resets the preflight used to provide

| Element | Add |
| --- | --- |
| `h1`–`h6` | `yst-my-0` (or explicit `yst-mt-*` and `yst-mb-*`) |
| `p` | `yst-my-0`, or set both vertical margins |
| `ul`, `ol` | `yst-my-0 yst-p-0`, plus `yst-list-none` unless you want markers |
| `li` | `yst-mb-0` unless you set a bottom margin (WordPress adds `6px`) |
| `strong`, `b` | `yst-font-bold` (WordPress sets `600`) |
| Any `yst-border*` width | `yst-border-solid` (enforced by the `yoast-local/border-requires-style` lint rule) |
| Bare `a` | The link styles you need, e.g. `yst-underline yst-text-indigo-600 hover:yst-text-indigo-500 focus:yst-shadow-none focus:yst-outline focus:yst-outline-offset-1 focus:yst-outline-indigo-600` |
| Bare `button` | `yst-m-0 yst-p-0 yst-border-0 yst-bg-transparent yst-cursor-pointer` |

Prefer ui-library components (`Title`, `Link`, `Button`, `Badge`, form fields) over bare elements: they carry these resets themselves.

## Why utilities and not component CSS

WordPress admin CSS targets elements with selectors like `input[type="text"]` (0,1,1) and `.wrap h1` (0,1,1), which beat a single class (0,1,0). Utilities are compiled with `!important`, so they win regardless. Rules built with `@apply` are not `!important`.

## Overriding ui-library styles

Override a ui-library component with at least two classes, e.g. `.my-feature .yst-text-input`. Component rules are (0,1,0) and native form controls are `html input.yst-*` (0,1,2), so a two-class override (0,2,0) wins regardless of stylesheet order. A single-class override ties and is decided by load order.

## Elementor

`css/src/elementor.css` styles the legacy panel with `.yoast a`, `.yoast p` and similar rules. They skip any element that has a `yst-` class, so give every element you render in the Elementor panel at least one `yst-` class.

## Checking your work

Render the screen with and without a `.yst-root` ancestor and compare the computed styles of your markup, or test it in the block editor, the classic editor and the Elementor panel, which all render outside a page-level `Root`.
