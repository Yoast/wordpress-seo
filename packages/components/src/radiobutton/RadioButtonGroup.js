import React, { Fragment } from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";
import { getId } from "../GenerateId";

import "./radiobutton.css";


/**
 * Component that generates a group of radio buttons.
 *
 * @param {object} props The props for this component.
 *
 * @returns {React.Component} A RadioButtonGroup.
 */
const RadioButtonGroup = ( props ) => {
	/**
	 * Function that returns a radiobutton with accompanying label.
	 *
	 * @param {string} groupName The name of the group to which the radiobutton belongs.
	 * @param {string} value The value of the radiobutton.
	 * @param {string} label The label that accompanies the radiobutton.
	 * @param {boolean} checked Whether the radiobutton is checked.
	 *
	 * @returns {React.Component} A single radiobutton field with label.
	 */
	const RadioButtonWithLabel = ( { groupName, value, label, checked } ) => <Fragment>
		<input
			type="radio"
			name={ groupName }
			id={ value }
			value={ value }
			defaultChecked={ checked }
			onChange={ props.onChange }
		/>
		<label
			htmlFor={ value }
		>
			{ label }
		</label>
	</Fragment>;

	RadioButtonWithLabel.propTypes = {
		groupName: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		checked: PropTypes.bool.isRequired,
	};

	/**
	 * Returns a set of radiobuttons that are on the same line.
	 *
	 * @returns {React.Component} A div with radiobuttons in it.
	 */
	const HorizontalRadioButtons = () =>
		<div className="yoast-field-group__radiobutton">
			{ props.options.map( option => <RadioButtonWithLabel key={ option.value }{ ...option } /> ) }
		</div>;

	/**
	 * Returns a set of radiobuttons that are vertically aligned.
	 *
	 * @returns {React.Component} A lot of divs with one radiobutton in it.
	 */
	const VerticalRadioButtons = () =>
		<Fragment>
			{ props.options.map( option => <div
				className="yoast-field-group__radiobutton yoast-field-group__radiobutton--vertical"
				key={ option.value }
			>
				<RadioButtonWithLabel { ...option } />
			</div>,
			) }
		</Fragment>;

	const id = getId( props.id );
	const fieldGroupProps = {
		htmlFor: id,
		...props,
	};
	return (
		<FieldGroup
			{ ...fieldGroupProps }
		>
			{ props.vertical ? <VerticalRadioButtons /> : <HorizontalRadioButtons /> }
		</FieldGroup>
	);
};

RadioButtonGroup.propTypes = {
	id: PropTypes.string,
	options: PropTypes.arrayOf( PropTypes.shape( {
		groupName: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		checked: PropTypes.bool.isRequired,
	} ) ).isRequired,
	onChange: PropTypes.func,
	vertical: PropTypes.bool,
	...FieldGroupProps,
};

RadioButtonGroup.defaultProps = {
	id: "",
	vertical: false,
	onChange: () => {},
	...FieldGroupDefaultProps,
};

export default RadioButtonGroup;
