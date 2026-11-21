import { useArgs } from "@storybook/preview-api";
import { noop } from "lodash";
import React, { useCallback } from "react";
import RadioGroup from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { childrenProp, component, variants, withLabelAndDescription, withValue } from "./docs";

const Template = ( args ) => {
	const [ { value }, updateArgs ] = useArgs();
	const handleChange = useCallback( newValue => updateArgs( { value: newValue } ), [ updateArgs ] );

	return (
		<RadioGroup { ...args } value={ value || "" } onChange={ handleChange } />
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "radio-group",
		name: "name",
		value: "1",
		options: [
			{ value: "1", label: "1", screenReaderLabel: "Option #1" },
			{ value: "2", label: "2", screenReaderLabel: "Option #2" },
			{ value: "3", label: "3", screenReaderLabel: "Option #3" },
			{ value: "4", label: "4", screenReaderLabel: "Option #4" },
		],
		label: "A Radio Group",
	},
};

export const Variants = {
	render: ( args ) => (
		<div className="yst-flex yst-flex-col yst-gap-4">
			<RadioGroup
				id="radio-group-1"
				name="name-1"
				value="2"
				options={ Factory.args.options }
				label="Default radio group"
				onChange={ noop }
			/>
			<hr />
			<RadioGroup
				id="radio-group-2"
				name="name-2"
				value="2"
				label="Inline-block radio group"
				description="Radio group with a description."
				options={ Factory.args.options }
				onChange={ noop }
				variant="inline-block"
			/>
		</div>
	),
	parameters: { docs: { description: { story: variants } } },
};

export const WithLabelAndDescription = {
	render: Template.bind( {} ),
	name: "With label and description",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withLabelAndDescription } },
	},
	args: {
		id: "radio-group-3",
		name: "name-3",
		label: "Radio group with a label",
		options: Factory.args.options,
		description: "Radio group with a description.",
	},
};

export const WithValue = {
	render: Template.bind( {} ),
	name: "With value",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withValue } },
	},
	args: {
		id: "radio-group-4",
		name: "name-4",
		value: "2",
		label: "Radio Group with a value",
		options: Factory.args.options,
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
		id: "radio-group-5",
		name: "name-5",
		label: "Radio Group with children",
		children: <>
			<RadioGroup.Radio defaultChecked={ true } value="child 1" label="Option 1" id="radio-1" name="name-5" />
			<RadioGroup.Radio value="child 2" label="Option 2" id="radio-2" name="name-5" />
			<RadioGroup.Radio value="child 3" label="Option 3" id="radio-3" name="name-5" />
		</>,
	},
};

export default {
	title: "2) Components/Radio group",
	component: RadioGroup,
	argTypes: {
		children: { control: { disable: true } },
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => <InteractiveDocsPage stories={ [ Variants, WithLabelAndDescription, WithValue, ChildrenProp ] } />,
		},
	},
};
