/* eslint-disable capitalized-comments */
import { useState, useCallback } from "@wordpress/element";

import CheckboxGroup from ".";

export default {
	title: "2. Components/Checkbox Group",
	component: CheckboxGroup,
	argTypes: {
		children: { control: "text" },
		label: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple checkbox group component.",
			},
		},
	},
};

const Template = ( args ) => {
	const [ values, setValues ] = useState( args.values || [] );
	const handleChange = useCallback( setValues, [ setValues ] );

	return (
		<CheckboxGroup { ...args } values={ values } onChange={ handleChange } />
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "checkbox-group",
	name: "name",
	values: [ "1" ],
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

export const WithLabelAndDescription = Template.bind();
WithLabelAndDescription.args = {
	id: "checkbox-group-1",
	name: "name-1",
	label: "Checkbox group with a label",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
	children: "Checkbox group with a description.",
};

export const WithValues = Template.bind();
WithValues.args = {
	id: "checkbox-group-2",
	name: "name-2",
	values: [ "2", "3" ],
	label: "Checkbox group with a label",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

