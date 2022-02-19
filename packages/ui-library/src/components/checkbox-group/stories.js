import CheckboxGroup from ".";

export default {
	title: "2. Components/CheckboxGroup",
	component: CheckboxGroup,
	parameters: {
		docs: {
			description: {
				component: "A simple radio group component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<CheckboxGroup { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "radio-group",
	name: "name",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

export const WithLabel = ( args ) => (
	<CheckboxGroup
		id="radio-group-1"
		name="name-1"
		options={ [
			{ value: "1", label: "Option 1" },
			{ value: "2", label: "Option 2" },
			{ value: "3", label: "Option 3" },
			{ value: "4", label: "Option 4" },
		] }
	>
		Checkbox group with a label
	</CheckboxGroup>
);
