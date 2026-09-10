The sub component `Table.ImageCell`. It renders a thumbnail for the given `src`, and falls back to a placeholder icon when no `src` is passed.

| Prop | Type | Description |
|---|---|---|
| `cellProps` | `Object` | Extra props for the `<td>` element (e.g. `colSpan`, `className`) |
| `imageProps` | `Object` | Props forwarded to the `<img>` element (e.g. `src`, `alt`, `className` ). |

#### Fixed width

The image column has a fixed width of `5.5rem` (88px). In the minimal variant, the first and last cells lose their horizontal padding, so the fixed width is automatically reduced by `0.75rem` to keep the column tight and avoid a visible gap.
