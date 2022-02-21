import Checkbox from ".";

export default {
	title: "1. Elements/Checkbox",
	component: Checkbox,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple checkbox component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<Checkbox { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "checkbox",
	name: "name",
	value: "value",
	label: "I am a checkbox.",
};
