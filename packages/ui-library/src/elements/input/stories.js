import { values } from "lodash";
import Input, { INPUT_TYPES } from ".";

export default {
	title: "1. Elements/Input",
	component: Input,
	argTypes: {
		type: { options: values( INPUT_TYPES ) },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple input component.",
			},
		},
	},
};

export const Factory = {
	component: ( args ) => <Input { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};
