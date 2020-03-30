/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import PropTypes from "prop-types";
import FieldGroup from "../field-group/FieldGroup";

import "./toggle.css";

/**
 * Creates a Toggle component.
 *
 * @param {object} props Props for the component.
 *
 * @returns {React.Component} The Toggle component.
 */
const Toggle = ( props ) => {
	const {
		id,
		name,
		value,
		checked,
		disabled,
		offText,
		onText,
		onChange,
		...fieldGroupProps
	} = props;
	return (
		<FieldGroup
			htmlFor={ id }
			{ ...fieldGroupProps }
		>
			<div className="yoast yoast-toggle">
				<input
					type="checkbox"
					id={ id }
					name={ name }
					value={ value }
					defaultChecked={ checked }
					disabled={ disabled }
					onChange={ onChange }
				/>
				<span className="yoast-toggle--inactive">{ offText }</span>
				<label className="yoast-toggle__switch" htmlFor={ id } id={ `${ id }-label` } />
				<span className="yoast-toggle--active">{ onText }</span>
			</div>
		</FieldGroup>
	);
};

Toggle.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	offText: PropTypes.string.isRequired,
	onText: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
};

Toggle.defaultProps = {
	checked: true,
	disabled: false,
	onChange: () => {},
};

export default Toggle;
