Three subcomponents and one hook add row-selection to any `Table`:

| Subcomponent / hook | Renders | Purpose |
|---|---|---|
| `Table.CheckboxProvider` | — (context only) | Owns selection state and exposes it to the subcomponents below |
| `Table.CheckboxHeader` | `<th>` | "Select all" checkbox in the column header; handles the indeterminate (−) state automatically |
| `Table.CheckboxCell` | `<td>` | Per-row checkbox |
| `useCheckboxTableContext` | — (hook) | Reads and drives the selection from anywhere inside the provider tree |

---

### Basic usage — let the provider own the state

Wrap your table in `Table.CheckboxProvider` and pass it the list of all selectable values (one string per row). The subcomponents wire themselves up automatically — no `checked` or `onChange` props needed on `Table.CheckboxHeader` or `Table.CheckboxCell`.

```jsx
<Table.CheckboxProvider allValues={rows.map(r => r.id)}>
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.CheckboxHeader
          id="select-all"
          name="select-all"
          aria-label="Select all"
          scope="col"
        />
        <Table.Header scope="col">Title</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {rows.map(row => (
        <Table.Row key={row.id}>
          <Table.CheckboxCell
            id={`select-${row.id}`}
            name={`select-${row.id}`}
            value={row.id}
            aria-label={`Select ${row.title}`}
          />
          <Table.Cell>{row.title}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</Table.CheckboxProvider>
```

Clicking the header checkbox selects all rows. When some (not all) rows are checked, the header checkbox renders in the indeterminate (−) state automatically. Clicking it again while indeterminate deselects all.

---

### Reading the selection from outside the table

Use `useCheckboxTableContext` inside any component that lives inside the provider tree. This is the right place to wire a "Select" menu or display a selected-count badge.

```jsx
import { useCheckboxTableContext } from "@yoast/ui-library";

const SelectMenu = () => {
  const { selectedValues, selectAll, deselectAll } = useCheckboxTableContext();

  return (
    <span>
      {selectedValues.size} selected —{" "}
      <button onClick={selectAll}>Select all</button>{" "}
      <button onClick={deselectAll}>Deselect all</button>
    </span>
  );
};
```

The full context shape:

| Value | Type | Description |
|---|---|---|
| `selectedValues` | `Set<string>` | The currently selected row values |
| `isAllSelected` | `boolean` | `true` when every value in `allValues` is selected |
| `isIndeterminate` | `boolean` | `true` when some (not all) values are selected |
| `toggleAll` | `() => void` | Deselects all if anything is selected; selects all otherwise |
| `toggleRow` | `(value: string) => void` | Toggles a single row |
| `selectAll` | `(values?: string[]) => void` | Selects the given values, or all `allValues` when omitted |
| `deselectAll` | `() => void` | Clears the selection |
| `isSelected` | `(value: string) => boolean` | Returns whether a value is currently selected |

`useCheckboxTableContext` returns `null` when called outside a `Table.CheckboxProvider`.

---

### Advanced usage — explicit props (no provider)

When selection state is managed externally (e.g. in a Redux store), skip the provider and pass `checked`, `indeterminate`, and `onChange` directly. The subcomponents prefer explicit props over context, so the two approaches can also coexist.

```jsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.CheckboxHeader
        id="select-all"
        name="select-all"
        checked={isAllSelected}
        indeterminate={isIndeterminate}
        onChange={onToggleAll}
        aria-label="Select all"
        scope="col"
      />
    </Table.Row>
  </Table.Head>
  <Table.Body>
    {rows.map(row => (
      <Table.Row key={row.id}>
        <Table.CheckboxCell
          id={`select-${row.id}`}
          name={`select-${row.id}`}
          value={String(row.id)}
          checked={selectedIds.includes(row.id)}
          onChange={e => onToggleRow(row.id, e.nativeEvent.shiftKey)}
          disabled={!row.editable}
          aria-label={`Select ${row.title}`}
        />
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

---

### Padding

`Table.CheckboxHeader` and `Table.CheckboxCell` use slightly narrower vertical padding (`py-3.5`) than regular `Table.Header` and `Table.Cell` (`py-4`), sized to keep the checkbox column compact.
