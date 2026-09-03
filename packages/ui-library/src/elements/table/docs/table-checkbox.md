Two subcomponents add a checkbox column to any `Table`:

| Subcomponent | Renders | Purpose |
|---|---|---|
| `Table.CheckboxHeader` | `<th>` | "Select all" checkbox in the column header; handles the indeterminate (−) state |
| `Table.CheckboxCell` | `<td>` | Per-row checkbox |

Both take the same two props: one object for the cell element, one for the checkbox inside it.

##### `Table.CheckboxHeader`

| Prop | Type | Description |
|---|---|---|
| `cellProps` | `Object` | Extra props for the `<th>` element (e.g. `colSpan`, `className`) |
| `checkboxProps` | `Object` | Props forwarded to the inner checkbox (`id`, `name`, `value`, `checked`, `onChange`, `disabled`, `aria-label`, etc.). Pass `indeterminate: true` to render the (−) state. |

##### `Table.CheckboxCell`

| Prop | Type | Description |
|---|---|---|
| `cellProps` | `Object` | Extra props for the `<td>` element (e.g. `colSpan`, `className`) |
| `checkboxProps` | `Object` | Props forwarded to the inner checkbox (`id`, `name`, `value`, `checked`, `onChange`, `disabled`, `aria-label`, etc.) |

Give every checkbox an accessible name — either `aria-label` in `checkboxProps`, or a visible `label`. These components do not track which rows are selected. Keep that state in your own component and pass `checked` and `onChange` through `checkboxProps`.

#### Padding

`Table.CheckboxHeader` and `Table.CheckboxCell` use slightly narrower vertical padding (`py-3.5`) than regular `Table.Header` and `Table.Cell` (`py-4`), sized to keep the checkbox column compact.
