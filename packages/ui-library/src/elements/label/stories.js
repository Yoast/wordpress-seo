import Label from ".";

export default {
	title: "1. Elements/Label",
	component: Label,
	argTypes: {
		as: { options: [ "label", "span", "div" ] },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple label component.",
			},
		},
	},
};

export const Factory = ( { ...args } ) => (
	<Label { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	label: "Label Factory",
};
