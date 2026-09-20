`Table.Pagination` renders a `<tfoot>` row that sits inside the table card and carries the page navigation controls.

Placing pagination here — rather than outside the table — lets it inherit the card's rounded corners and keeps its visual boundary flush with the rest of the table.

| Prop | Type | Required | Description |
|---|---|---|---|
| `colSpan` | `number` | ✓ | Number of columns the footer cell should span (should match your table's column count). |
| `page` | `number` | ✓ | The current page (1-based). |
| `totalPages` | `number` | ✓ | Total number of pages. Returns `null` when `≤ 1`. |
| `onNavigate` | `function` | ✓ | Called with the target page number when the user clicks a page button. |
| `screenReaderTextPrevious` | `string` | ✓ | Accessible label for the previous button. |
| `screenReaderTextNext` | `string` | ✓ | Accessible label for the next button. |
| `summary` | `node` | | "Showing X to Y of Z results" content rendered on the left. Hidden on small screens. |
| `maxPageButtons` | `number` | | Maximum page number buttons to show. Defaults to `6`. |
| `disabled` | `boolean` | | Disables all buttons (e.g. while a fetch is in flight). |
| `className` | `string` | | Extra class names applied to the footer `<td>`. |

Any additional props are forwarded to the inner `Pagination` nav (e.g. `aria-label`).

#### Last-row rounding

The `default` variant's stylesheet automatically suppresses the bottom rounded corners on the last `<tbody>` row when a `<tfoot>` is present, using a `:has(tfoot)` rule. No extra class is needed on the consumer side.
