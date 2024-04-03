import React, { useCallback, useMemo } from "react";
import Select from "react-select";

/**
 * Select with isMulti, but only having to provide flat string values.
 * Instead of objects with label and value, as the Select API requires.
 *
 * @param {string[]} value The selected values.
 * @param {function} onChange The change handler.
 * @param {string[]} options The values that can be selected.
 * @param {Object} [props] Additional props.
 *
 * @returns {JSX.Element} The element.
 */
export const SimpleMultiSelect = ( { value, onChange, options, ...props } ) => {
	const valueWithLabels = useMemo( () => value.map( item => ( { label: item, value: item } ) ), [ value ] );
	const optionsWithLabels = useMemo( () => options.map( item => ( { label: item, value: item } ) ), [ options ] );

	const handleChange = useCallback( selected => {
		onChange( selected ? selected.map( item => item.value ) : [] );
	}, [ onChange ] );

	return <Select
		{ ...props }
		value={ valueWithLabels }
		options={ optionsWithLabels }
		onChange={ handleChange }
		isMulti={ true }
	/>;
};
