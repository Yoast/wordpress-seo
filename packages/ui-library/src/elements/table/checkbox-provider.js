import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CheckboxTableContext } from "./context";

/**
 * Provides internal checkbox selection state for Table.CheckboxHeader and Table.CheckboxCell.
 * When wrapped in this provider, those subcomponents do not need explicit checked/onChange props.
 * Use `useCheckboxTableContext` inside the provider tree to observe selection state.
 *
 * @param {string[]} props.allValues All selectable values (one per row).
 * @param {JSX.node} props.children  The table and its contents.
 * @returns {JSX.Element} The provider.
 */
export const CheckboxProvider = ( { allValues, children } ) => {
	const [ selectedValues, setSelectedValues ] = useState( new Set() );

	const allValuesSet = useMemo( () => new Set( allValues ), [ allValues ] );

	useEffect( () => {
		setSelectedValues( ( prev ) => {
			const next = new Set( [ ...prev ].filter( ( v ) => allValuesSet.has( v ) ) );
			return next.size === prev.size ? prev : next;
		} );
	}, [ allValuesSet ] );

	const isAllSelected = allValuesSet.size > 0 && selectedValues.size === allValuesSet.size;
	const isIndeterminate = selectedValues.size > 0 && ! isAllSelected;

	const toggleAll = useCallback( () => {
		setSelectedValues( selectedValues.size > 0 ? new Set() : new Set( allValues ) );
	}, [ selectedValues, allValues ] );

	const toggleRow = useCallback( ( value ) => {
		setSelectedValues( ( prev ) => {
			const next = new Set( prev );
			if ( next.has( value ) ) {
				next.delete( value );
			} else {
				next.add( value );
			}
			return next;
		} );
	}, [] );

	const selectAll = useCallback( ( values ) => {
		setSelectedValues( new Set( values ?? allValues ) );
	}, [ allValues ] );

	const deselectAll = useCallback( () => {
		setSelectedValues( new Set() );
	}, [] );

	const isSelected = useCallback( ( value ) => selectedValues.has( value ), [ selectedValues ] );

	return (
		<CheckboxTableContext.Provider
			value={ { selectedValues, isAllSelected, isIndeterminate, toggleAll, toggleRow, selectAll, deselectAll, isSelected } }
		>
			{ children }
		</CheckboxTableContext.Provider>
	);
};
