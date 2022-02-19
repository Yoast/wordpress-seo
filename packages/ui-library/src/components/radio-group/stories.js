import RadioGroup from ".";

export default {
	title: "2. Components/RadioGroup",
	component: RadioGroup,
	parameters: {
		docs: {
			description: {
				component: "A simple radio group component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<RadioGroup { ...args } />
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
	<RadioGroup
		id="radio-group-1"
		name="name-1"
		options={ [
			{ value: "1", label: "Option 1" },
			{ value: "2", label: "Option 2" },
			{ value: "3", label: "Option 3" },
			{ value: "4", label: "Option 4" },
		] }
	>
		Radio group with a label
	</RadioGroup>
);


export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<RadioGroup
			id="radio-group-1"
			name="name-1"
			options={ [
				{ value: "1", label: "Option 1" },
				{ value: "2", label: "Option 2" },
				{ value: "3", label: "Option 3" },
				{ value: "4", label: "Option 4" },
			] }
		/>
		<hr />
		<RadioGroup
			id="radio-group-2"
			name="name-2"
			options={ [
				{ value: "1", label: "1" },
				{ value: "2", label: "2" },
				{ value: "3", label: "3" },
				{ value: "4", label: "4" },
			] }
			variant="inline-block"
		>
			Radio group with a label
		</RadioGroup>
	</div>
);
