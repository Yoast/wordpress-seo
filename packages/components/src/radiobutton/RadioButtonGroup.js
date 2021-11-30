import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { noop } from "lodash";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";
import { getId } from "../GenerateId";

import "./radiobutton.css";

const radioButtonsProps = {
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	groupName: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	selected: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
};

const radioButtonsDefaultProps = {
	selected: null,
};

/**
 * Function that returns a radiobutton with accompanying label.
 *
 * @param {string} value The value of the radiobutton.
 * @param {string} label The label that accompanies the radiobutton.
 * @param {boolean} checked Whether the radiobutton is checked.
 * @param {onChange} onChange A function for the onChange.
 * @param {string} groupName The name of the group of radio buttons.
 * @param {string} id The id of the radio button.
 *
 * @returns {React.Component} A single radiobutton field with label.
 */
const LabeledRadioButton = ( { value, label, checked, onChange, groupName, id } ) => <Fragment>
	<input
		type="radio"
		name={ groupName }
		id={ id }
		value={ value }
		onChange={ onChange }
		checked={ checked }
	/>
	<label
		htmlFor={ id }
	>
		{ label }
	</label>
</Fragment>;

LabeledRadioButton.propTypes = {
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	groupName: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	id: PropTypes.string.isRequired,
};

LabeledRadioButton.defaultProps = {
	checked: false,
	onChange: noop,
};

/**
 * Returns a set of radiobuttons that are on the same line.
 *
 * @param {array} options An array of options for the radio buttons.
 * @param {function} onChange The onChange function.
 * @param {string} groupName The name of the radio button group.
 * @param {string} id The id of the component.
 * @param {string} selected Optional: the selected radio button.
 *
 * @returns {React.Component} A div with radiobuttons in it.
 */
const HorizontalRadioButtons = ( { options, onChange, groupName, id, selected } ) => (
	<div className="yoast-field-group__radiobutton">
		{ options.map( option => {
			return (
				<LabeledRadioButton
					key={ option.value }
					groupName={ groupName }
					checked={ selected === option.value }
					onChange={ onChange }
					id={ `${ id }_${ option.value }` }
					{ ...option }
				/>
			);
		} ) }
	</div>
);

HorizontalRadioButtons.propTypes = radioButtonsProps;
HorizontalRadioButtons.defaultProps = radioButtonsDefaultProps;

/**
 * Returns a set of radiobuttons that are vertically aligned.
 *
 * @param {array} options An array of options for the radio buttons.
 * @param {function} onChange The onChange function.
 * @param {string} groupName The name of the radio button group.
 * @param {string} id The id of the component.
 * @param {string} selected Optional: the selected radio button.
 *
 * @returns {React.Component} A lot of divs with one radiobutton in it.
 */
const VerticalRadioButtons = ( { options, onChange, groupName, id, selected } ) => (
	<div onChange={ onChange }>
		{ options.map( option => <div
			className="yoast-field-group__radiobutton yoast-field-group__radiobutton--vertical"
			key={ option.value }
		>
			<LabeledRadioButton
				groupName={ groupName }
				checked={ selected === option.value }
				id={ `${ id }_${ option.value }` }
				{ ...option }
			/>
		</div>
		) }
	</div>
);

VerticalRadioButtons.propTypes = radioButtonsProps;
VerticalRadioButtons.defaultProps = radioButtonsDefaultProps;

/**
 * Component that generates a group of radio buttons.
 *
 * @param {object} props The props for this component.
 *
 * @returns {React.Component} A RadioButtonGroup.
 */
const RadioButtonGroup = props => {
	const {
		id,
		options,
		groupName,
		onChange,
		vertical,
		selected,
		...fieldGroupProps
	} = props;
	const componentId = getId( id );

	const radioButtonProps = {
		options,
		groupName,
		selected,
		onChange: event => onChange( event.target.value ),
		id: componentId,
	};

	return (
		<FieldGroup
			{ ...fieldGroupProps }
		>
			{ vertical
				? <VerticalRadioButtons { ...radioButtonProps } />
				: <HorizontalRadioButtons { ...radioButtonProps } />
			}
		</FieldGroup>
	);
};

RadioButtonGroup.propTypes = {
	id: PropTypes.string,
	groupName: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
		label: PropTypes.string.isRequired,
	} ) ).isRequired,
	selected: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
	onChange: PropTypes.func,
	vertical: PropTypes.bool,
	...FieldGroupProps,
};

RadioButtonGroup.defaultProps = {
	id: "",
	vertical: false,
	selected: null,
	onChange: () => {},
	...FieldGroupDefaultProps,
};

export default RadioButtonGroup;
