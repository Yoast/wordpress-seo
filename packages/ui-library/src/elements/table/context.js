import { createContext, useContext } from "react";

export const CheckboxTableContext = createContext( null );

/**
 * Returns the checkbox selection context exposed by Table.CheckboxProvider.
 * Use this hook inside a Table.CheckboxProvider tree to read or drive selection state
 * from outside the Table subcomponents (e.g. a "Select all / deselect all" menu).
 *
 * @returns {{ selectedValues: Set<string>, isAllSelected: boolean, isIndeterminate: boolean,
 *             toggleAll: Function, toggleRow: Function,
 *             selectAll: Function, deselectAll: Function,
 *             isSelected: Function } | null} The context value, or null when called outside a provider.
 */
export const useCheckboxTableContext = () => useContext( CheckboxTableContext );
