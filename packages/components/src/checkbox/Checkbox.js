import React, { useCallback } from "react";
import { FieldGroup } from "../field-group";
import "./checkbox.css";

/**
 * Represents the input type checkbox with a label, inside a FieldGroup.
 *
 * @param {Object} props The component properties.
 * @param {string} props.id The id of the checkbox.
 * @param {(string|import("react").ReactNode[]|import("react").ReactNode)} props.label The label of the checkbox.
 * @param {boolean} [props.checked=false] Whether the checkbox is checked.
 * @param {Function} props.onChange The function to call with the checkbox value when it changes.
 *
 * @returns {JSX.Element} A React component that wraps around the HTML checkbox.
 */
export default function Checkbox( { checked = false, ...props } ) {
	const handleChange = useCallback( ( event ) => {
		props.onChange( event.target.value );
	}, [ props.onChange ] );

	return (
		<FieldGroup wrapperClassName="yoast-field-group yoast-field-group__checkbox">
			<input type="checkbox" id={ props.id } checked={ checked } onChange={ handleChange } />
			<label htmlFor={ props.id }>{ props.label }</label>
		</FieldGroup>
	);
}
