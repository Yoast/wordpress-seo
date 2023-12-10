import Textarea from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Textarea",
	component: Textarea,
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
