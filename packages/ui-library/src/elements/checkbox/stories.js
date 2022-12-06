import Checkbox from ".";

export default {
	title: "1. Elements/Checkbox",
	component: Checkbox,
	argTypes: {},
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
	controls: { disabled: false },
};
Factory.args = {
	id: "checkbox",
	name: "name",
	value: "value",
	label: "I am a checkbox.",
	disabled: false,
};

export const Disabled = ( args ) => (
	<Checkbox { ...args } />
);
Disabled.parameters = {
	controls: { disable: true },
};
Disabled.args = {
	id: "checkbox",
	name: "name",
	value: "value",
	label: "I am a checkbox.",
	disabled: true,
};
