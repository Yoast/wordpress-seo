Two subcomponents add a checkbox column to any `Table`:

| Subcomponent | Renders | Purpose |
|---|---|---|
| `Table.CheckboxHeader` | `<th>` | "Select all" checkbox in the column header; handles the indeterminate (−) state |
| `Table.CheckboxCell` | `<td>` | Per-row checkbox |

### Props

**`Table.CheckboxHeader/Table.CheckboxCell`**

| Prop | Type | Description |
|---|---|---|
| `inputProps` | `Object` | Props forwarded to the inner checkbox (`id`, `name`, `checked`, `indeterminate`, `onChange`, `aria-label`, etc.). Pass `indeterminate: true` to render the (−) state. |
| `cellProps` | `Object` | Extra props for the `<th>` element (e.g. `colSpan`, `className`) |

---

### Padding

`Table.CheckboxHeader` and `Table.CheckboxCell` use slightly narrower vertical padding (`py-3.5`) than regular `Table.Header` and `Table.Cell` (`py-4`), sized to keep the checkbox column compact.
