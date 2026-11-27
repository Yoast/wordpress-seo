import React, { Fragment } from "react";
import { noop } from "lodash";
import FieldGroup from "../field-group/FieldGroup";
import { getId } from "../GenerateId";

import "./radiobutton.css";

/**
 * Function that returns a radiobutton with accompanying label.
 *
 * @param {Object} props Component props.
 * @param {(string|number)} props.value The value of the radiobutton.
 * @param {string} props.label The label that accompanies the radiobutton.
 * @param {boolean} [props.checked=false] Whether the radiobutton is checked.
 * @param {string} props.groupName The name of the group of radio buttons.
 * @param {Function} [props.onChange=noop] A function for the onChange.
 * @param {string} props.id The id of the radio button.
 *
 * @returns {React.Component} A single radiobutton field with label.
 */
const LabeledRadioButton = ( { value, label, checked = false, onChange = noop, groupName, id } ) => <Fragment>
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

/**
 * Returns a set of radiobuttons that are on the same line.
 *
 * @param {Object} props Component props.
 * @param {Array} props.options An array of options for the radio buttons.
 * @param {Function} props.onChange The onChange function.
 * @param {string} props.groupName The name of the radio button group.
 * @param {string} props.id The id of the component.
 * @param {(string|number)} [props.selected=null] Optional: the selected radio button.
 *
 * @returns {React.Component} A div with radiobuttons in it.
 */
const HorizontalRadioButtons = ( { options, onChange, groupName, id, selected = null } ) => (
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

/**
 * Returns a set of radiobuttons that are vertically aligned.
 *
 * @param {Object} props Component props.
 * @param {Array} props.options An array of options for the radio buttons.
 * @param {Function} props.onChange The onChange function.
 * @param {string} props.groupName The name of the radio button group.
 * @param {string} props.id The id of the component.
 * @param {(string|number)} [props.selected=null] Optional: the selected radio button.
 *
 * @returns {React.Component} A lot of divs with one radiobutton in it.
 */
const VerticalRadioButtons = ( { options, onChange, groupName, id, selected = null } ) => (
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

/**
 * Component that generates a group of radio buttons.
 *
 * @param {Object} props The props for this component. Also accepts the FieldGroup props (see field-group/FieldGroup.js).
 * @param {string} [props.id=""] The id of the component.
 * @param {string} props.groupName The name of the radio button group.
 * @param {Object[]} props.options An array of options for the radio buttons.
 * @param {(string|number)} props.options[].value The value of the radio button.
 * @param {string} props.options[].label The label of the radio button.
 * @param {(string|number)} [props.selected=null] The selected radio button.
 * @param {Function} [props.onChange=noop] The function to call with the selected value when it changes.
 * @param {boolean} [props.vertical=false] Whether to align the radio buttons vertically.
 *
 * @returns {React.Component} A RadioButtonGroup.
 */
const RadioButtonGroup = ( {
	id = "",
	options,
	groupName,
	onChange = noop,
	vertical = false,
	selected = null,
	...fieldGroupProps
} ) => {
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

export default RadioButtonGroup;
