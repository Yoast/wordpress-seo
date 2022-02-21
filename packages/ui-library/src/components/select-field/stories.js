/* eslint-disable capitalized-comments */
import { useState, useCallback } from "@wordpress/element";

import SelectField from ".";

export default {
	title: "2. Components/Select Field",
	component: SelectField,
	argTypes: {
		children: { control: "text" },
		label: { control: "text" },
		error: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple select field component.",
			},
		},
	},
};

const Template = ( args ) => {
	const [ value, setValues ] = useState( args.value || "" );
	const handleChange = useCallback( setValues, [ setValues ] );

	return (
		// Min height to make room for options dropdown.
		<div style={ { minHeight: 200 } }>
			<SelectField { ...args } value={ value } onChange={ handleChange } />
		</div>
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "select-field",
	name: "name",
	value: "1",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

export const WithLabelAndDescription = Template.bind();
WithLabelAndDescription.args = {
	id: "select-field-1",
	name: "name-1",
	label: "Select field with a label",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
	children: "Select field with a description.",
};

export const WithError = Template.bind();
WithError.args = {
	id: "select-field-2",
	name: "name-2",
	value: "2",
	label: "Select field with a label",
	error: "Select field with an error.",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

