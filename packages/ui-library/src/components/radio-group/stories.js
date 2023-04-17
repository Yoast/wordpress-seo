import { useState, useCallback } from "@wordpress/element";
import { noop } from "lodash";

import RadioGroup from ".";

export default {
	title: "2) Components/Radio group",
	component: RadioGroup,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple radio group component.",
			},
		},
	},

};

const Template = ( args ) => {
	const [ value, setValue ] = useState( args.value || "" );
	const handleChange = useCallback( setValue, [ setValue ] );

	return (
		<RadioGroup { ...args } value={ value } onChange={ handleChange } />
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
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
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<RadioGroup
			id="radio-group-1"
			name="name-1"
			value="2"
			options={ [
				{ value: "1", label: "1", screenReaderLabel: "Option #1" },
				{ value: "2", label: "2", screenReaderLabel: "Option #2" },
				{ value: "3", label: "3", screenReaderLabel: "Option #3" },
				{ value: "4", label: "4", screenReaderLabel: "Option #4" },
			] }
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
			options={ [
				{ value: "1", label: "1", screenReaderLabel: "Option #1" },
				{ value: "2", label: "2", screenReaderLabel: "Option #2" },
				{ value: "3", label: "3", screenReaderLabel: "Option #3" },
				{ value: "4", label: "4", screenReaderLabel: "Option #4" },
			] }
			onChange={ noop }
			variant="inline-block"
		/>
	</div>
);
Variants.parameters = {
	docs: { description: { story: "In the `inline-block` variant, the `screenReaderLabel` prop is used to provide screen readers with a useful label." } },
};

export const WithLabelAndDescription = Template.bind();
WithLabelAndDescription.storyName = "With label and description";
WithLabelAndDescription.args = {
	id: "radio-group-3",
	name: "name-3",
	label: "Radio group with a label",
	options: [
		{ value: "1", label: "1", screenReaderLabel: "Option #1" },
		{ value: "2", label: "2", screenReaderLabel: "Option #2" },
		{ value: "3", label: "3", screenReaderLabel: "Option #3" },
		{ value: "4", label: "4", screenReaderLabel: "Option #4" },
	],
	description: "Radio group with a description.",
};

export const WithValue = Template.bind();
WithValue.storyName = "With value";
WithValue.args = {
	id: "radio-group-4",
	name: "name-4",
	value: "2",
	label: "Radio group with a label",
	options: [
		{ value: "1", label: "1", screenReaderLabel: "Option #1" },
		{ value: "2", label: "2", screenReaderLabel: "Option #2" },
		{ value: "3", label: "3", screenReaderLabel: "Option #3" },
		{ value: "4", label: "4", screenReaderLabel: "Option #4" },
	],
};

export const ChildrenProp = Template.bind();
ChildrenProp.storyName = "Children prop";
ChildrenProp.args = {
	id: "radio-group-5",
	name: "name-5",
	label: "Radio group label.",
	children: <>
		<RadioGroup.Radio defaultChecked={ true } value="child 1" label="Option 1" id="radio-1" name="name-5" />
		<RadioGroup.Radio value="child 2" label="Option 2" id="radio-2" name="name-5" />
		<RadioGroup.Radio value="child 3" label="Option 3" id="radio-3" name="name-5" />
	</>,
};

ChildrenProp.parameters = { docs: { description: { story: "The `children` prop can be used to render custom content. The options are rendered using the sub component `Radio` (`RadioGroup.Radio` is equal to `Radio` element). Default values should be set inside the child component and not the `value` prop." } } };


