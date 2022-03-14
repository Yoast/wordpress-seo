import { useState, useCallback } from "@wordpress/element";
import { noop } from "lodash";

import RadioGroup from ".";

export default {
	title: "2. Components/Radio Group",
	component: RadioGroup,
	argTypes: {
		children: { control: "text" },
		label: { control: "text" },
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
		{ value: "1", label: "1", srLabel: "Option #1" },
		{ value: "2", label: "2", srLabel: "Option #2" },
		{ value: "3", label: "3", srLabel: "Option #3" },
		{ value: "4", label: "4", srLabel: "Option #4" },
	],
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<RadioGroup
			id="radio-group-1"
			name="name-1"
			value="2"
			options={ [
				{ value: "1", label: "1", srLabel: "Option #1" },
				{ value: "2", label: "2", srLabel: "Option #2" },
				{ value: "3", label: "3", srLabel: "Option #3" },
				{ value: "4", label: "4", srLabel: "Option #4" },
			] }
			onChange={ noop }
		/>
		<hr />
		<RadioGroup
			id="radio-group-2"
			name="name-2"
			value="2"
			label="Radio group with a label"
			options={ [
				{ value: "1", label: "1", srLabel: "Option #1" },
				{ value: "2", label: "2", srLabel: "Option #2" },
				{ value: "3", label: "3", srLabel: "Option #3" },
				{ value: "4", label: "4", srLabel: "Option #4" },
			] }
			onChange={ noop }
			variant="inline-block"
		>
			Radio group with a description.
		</RadioGroup>
	</div>
);

export const WithLabelAndDescription = Template.bind();
WithLabelAndDescription.args = {
	id: "radio-group-3",
	name: "name-3",
	label: "Radio group with a label",
	options: [
		{ value: "1", label: "1", srLabel: "Option #1" },
		{ value: "2", label: "2", srLabel: "Option #2" },
		{ value: "3", label: "3", srLabel: "Option #3" },
		{ value: "4", label: "4", srLabel: "Option #4" },
	],
	children: "Radio group with a description.",
};

export const WithValue = Template.bind();
WithValue.args = {
	id: "radio-group-4",
	name: "name-4",
	value: "2",
	label: "Radio group with a label",
	options: [
		{ value: "1", label: "1", srLabel: "Option #1" },
		{ value: "2", label: "2", srLabel: "Option #2" },
		{ value: "3", label: "3", srLabel: "Option #3" },
		{ value: "4", label: "4", srLabel: "Option #4" },
	],
};
