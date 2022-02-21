import { useState, useCallback } from "@wordpress/element";

import ToggleField from ".";

export default {
	title: "2. Components/Toggle Field",
	component: ToggleField,
	argTypes: {
		children: { control: "text" },
		label: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple toggle field component.",
			},
		},
	},
};

const Template = ( args ) => {
	const [ checked, setChecked ] = useState( args.checked || false );
	const handleChange = useCallback( setChecked, [ setChecked ] );

	return (
		<ToggleField { ...args } checked={ checked } onChange={ handleChange } />
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "toggle-field",
};

export const WithLabelAndDescription = Template.bind( {} );
WithLabelAndDescription.args = {
	id: "checkbox-group-1",
	name: "name-1",
	label: "Toggle field with a label",
	children: "Toggle field with a description.",
};

export const Checked = Template.bind( {} );
Checked.args = {
	id: "checkbox-group-2",
	name: "name-2",
	checked: true,
	label: "Toggle field with a label",
};
