import TextInput from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Text input",
	component: TextInput,
	parameters: {
		docs: {
			description: {
				component,
			},
		},
	},
};

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
};

export const DatePicker = {
	name: "Date picker input",
	parameters: {
		controls: { disable: false },
	},
	args: {
		type: "date",
	},
};
