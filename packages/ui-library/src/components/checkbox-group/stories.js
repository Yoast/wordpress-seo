import { useState, useCallback } from "@wordpress/element";

import CheckboxGroup from ".";

export default {
	title: "2. Components/Checkbox Group",
	component: CheckboxGroup,
	argTypes: {
		children: { control: "text" },
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
	label: "A Checkbox Group",
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

export const ChildrenProp = Template.bind();
ChildrenProp.args = {
	id: "checkbox-group-3",
	name: "name-3",
	label: "Checkbox group label.",
	children: <>
		<CheckboxGroup.Option value="child 1" label="Option 1" id="option-1" name="option-1" />
		<CheckboxGroup.Option value="child 2" label="Option 2" id="option-2" name="option-2" />
		<CheckboxGroup.Option value="child 3" label="Option 3" id="option-3" name="option-3" />
	</>,
};

ChildrenProp.parameters = { docs: { description: { story: "The `children` prop can be used to render custom content. The options are rendered using the sub component `Option` (`CheckboxGroup.Option` is equal to `Checkbox` component). Default values should be set inside the child component and not the `value` prop." } } };

