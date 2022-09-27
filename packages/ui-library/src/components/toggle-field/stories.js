import { useCallback, useState } from "@wordpress/element";

import ToggleField from ".";
import Badge from "../../elements/badge";

export default {
	title: "2. Components/Toggle Field",
	component: ToggleField,
	argTypes: {
		children: { control: "text" },
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
	label: "A Toggle Field",
};

export const WithLabelAndDescription = Template.bind( {} );
WithLabelAndDescription.args = {
	name: "name-1",
	label: "Toggle field with a label",
	children: "Toggle field with a description.",
};

export const Checked = Template.bind( {} );
Checked.args = {
	name: "name-2",
	checked: true,
	label: "Checked toggle field",
};

export const WithLabelSuffix = Template.bind( {} );
WithLabelSuffix.args = {
	name: "name-3",
	checked: true,
	label: "Label suffix toggle field",
	labelSuffix: <Badge className="yst-ml-1.5" variant="upsell">Premium</Badge>,
};
