// eslint-disable-next-line import/no-extraneous-dependencies
import { useArgs } from "@storybook/preview-api";
import React, { useCallback } from "react";
import CheckboxGroup from ".";
import { childrenProp, component, disabled, withLabelAndDescription, withValues } from "./docs";

export default {
	title: "2) Components/Checkbox group",
	component: CheckboxGroup,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component,
			},
		},
	},
};

const Template = ( args ) => {
	const [ { values }, updateArgs ] = useArgs();
	const handleChange = useCallback( newValues => updateArgs( { values: newValues } ), [ updateArgs ] );

	return (
		<CheckboxGroup { ...args } values={ values || [] } onChange={ handleChange } />
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "checkbox-group",
		name: "name",
		values: [ "1" ],
		options: [
			{ value: "1", label: "Option 1" },
			{ value: "2", label: "Option 2" },
			{ value: "3", label: "Option 3" },
			{ value: "4", label: "Option 4" },
		],
		label: "A checkbox group",
	},
};

export const WithLabelAndDescription = {
	render: Template.bind( {} ),
	name: "With label and description",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withLabelAndDescription } },
	},
	args: {
		id: "checkbox-group-1",
		name: "name-1",
		label: "Checkbox group with a label",
		options: [
			{ value: "1", label: "Option 1" },
			{ value: "2", label: "Option 2" },
			{ value: "3", label: "Option 3" },
			{ value: "4", label: "Option 4" },
		],
		description: "Checkbox group with a description.",
	},
};

export const WithValues = {
	render: Template.bind( {} ),
	name: "With values",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withValues } },
	},
	args: {
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
	},
};

export const ChildrenProp = {
	render: Template.bind( {} ),
	name: "Children prop",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: childrenProp } },
	},
	args: {
		id: "checkbox-group-3",
		name: "name-3",
		label: "Checkbox group label.",
		children: <>
			<CheckboxGroup.Checkbox defaultChecked={ true } value="child 1" label="Option 1" id="option-1" name="name-3" />
			<CheckboxGroup.Checkbox value="child 2" label="Option 2" id="option-2" name="name-3" />
			<CheckboxGroup.Checkbox value="child 3" label="Option 3" id="option-3" name="name-3" />
		</>,
	},
};

export const Disabled = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
		docs: { description: { story: disabled } },
	},
	args: {
		id: "checkbox-group-4",
		name: "name-4",
		values: [ "2", "3" ],
		label: "Checkbox group with a label",
		description: "Checkbox group with a description.",
		disabled: true,
		options: [
			{ value: "1", label: "Option 1" },
			{ value: "2", label: "Option 2" },
			{ value: "3", label: "Option 3" },
			{ value: "4", label: "Option 4" },
		],
	},
};
