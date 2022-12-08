import TextInput from ".";

export default {
	title: "1. Elements/Text Input",
	component: TextInput,
	argTypes: {
		type: {
			control: "text",
			table: { defaultValue: { summary: "text" },
			} },
		disabled: {
			control: "boolean",
			table: { defaultValue: { summary: "false" },
			} },
		readOnly: { control: "boolean", table: { defaultValue: { summary: "false" },
		} },
		className: { control: "text" },
		ref: { control: "ref", table: { type: { summary: "React ref" } } },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple text input component.",
			},
		},
	},
};

export const Factory = {
	component: ( args ) => <TextInput { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};
