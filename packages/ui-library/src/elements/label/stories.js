import Label from ".";

export default {
	title: "1. Elements/Label",
	component: Label,
	argTypes: {
		children: { control: "text" },
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

export const Factory = ( { children, ...args } ) => (
	<Label { ...args }>{ children }</Label>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Label Factory",
};
