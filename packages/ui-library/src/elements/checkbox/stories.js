import Checkbox from ".";

export default {
	title: "1. Elements/Checkbox",
	component: Checkbox,
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
	children: "I am a checkbox.",
	id: "checkbox",
	name: "name",
	value: "value",
};
