import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { FieldGroup } from "../field-group";
import "./checkbox.css";

/**
 * Represents the input type checkbox with a label, inside a FieldGroup.
 *
 * @param {Object} props The component properties.
 *
 * @returns {JSX.Element} A React component that wraps around the HTML checkbox.
 */
export default function Checkbox( { id, label, checked = false, onChange } ) {
	const handleChange = useCallback( ( event ) => {
		onChange( event.target.value );
	}, [ onChange ] );

	return (
		<FieldGroup wrapperClassName="yoast-field-group yoast-field-group__checkbox">
			<input type="checkbox" id={ id } checked={ checked } onChange={ handleChange } />
			<label htmlFor={ id }>{ label }</label>
		</FieldGroup>
	);
}

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};
