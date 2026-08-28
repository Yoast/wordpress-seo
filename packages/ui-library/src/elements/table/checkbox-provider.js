import PropTypes from "prop-types";
import React, {  useCallback, useState } from "react";
import { CheckboxTableContext } from "./context";

/**
 * Provides internal checkbox selection state for Table.CheckboxHeader and Table.CheckboxCell.
 * When wrapped in this provider, those subcomponents do not need explicit checked/onChange props.
 *
 * @param {string[]} props.allValues All selectable values (one per row).
 * @param {Function} [props.onChange] Called with the new selected-values array on every change.
 * @param {JSX.node} props.children  The table and its contents.
 * @returns {JSX.Element} The provider.
 */
export const CheckboxProvider = ( { allValues, onChange, children } ) => {
	const [ selectedValues, setSelectedValues ] = useState( new Set() );

	const isAllSelected = allValues.length > 0 && selectedValues.size === allValues.length;
	const isIndeterminate = selectedValues.size > 0 && ! isAllSelected;

	const update = useCallback( ( next ) => {
		setSelectedValues( next );
		onChange?.( Array.from( next ) );
	}, [ onChange ] );

	const toggleAll = useCallback( () => {
		update( selectedValues.size > 0 ? new Set() : new Set( allValues ) );
	}, [ selectedValues, allValues, update ] );

	const toggleRow = useCallback( ( value ) => {
		const next = new Set( selectedValues );
		if ( next.has( value ) ) {
			next.delete( value );
		} else {
			next.add( value );
		}
		update( next );
	}, [ selectedValues, update ] );

	const selectAll = useCallback( ( values ) => {
		update( new Set( values ?? allValues ) );
	}, [ allValues, update ] );

	const deselectAll = useCallback( () => {
		update( new Set() );
	}, [ update ] );

	const isSelected = useCallback( ( value ) => selectedValues.has( value ), [ selectedValues ] );

	return (
		<CheckboxTableContext.Provider
			value={ { selectedValues, isAllSelected, isIndeterminate, toggleAll, toggleRow, selectAll, deselectAll, isSelected } }
		>
			{ children }
		</CheckboxTableContext.Provider>
	);
};

CheckboxProvider.propTypes = {
	allValues: PropTypes.arrayOf( PropTypes.string ).isRequired,
	onChange: PropTypes.func,
	children: PropTypes.node.isRequired,
};
