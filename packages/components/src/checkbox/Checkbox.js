import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { FieldGroup } from "../field-group";
import "./checkbox.css";

/**
 * Represents the input type checkbox with a label. Optionally a FieldGroup.
 *
 * @param {Object} props The component properties.
 *
 * @returns {JSX.Element} A React component that wraps around the HTML checkbox.
 */
export default function Checkbox( props ) {
	const handleChange = useCallback( ( event ) => {
		props.onChange( event.target.value );
	}, [ props.onChange ] );

	return (
		<FieldGroup wrapperClassName="yoast-field-group yoast-field-group__checkbox">
			<input type="checkbox" id={ props.id } checked={ props.checked } onChange={ handleChange } />
			<label htmlFor={ props.id }>{ props.label }</label>
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

Checkbox.defaultProps = {
	checked: false,
};
