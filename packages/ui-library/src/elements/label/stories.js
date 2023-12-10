import Label from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Label",
	component: Label,
	argTypes: {
		as: { options: [ "label", "span", "div" ] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		label: "Label factory",
	},
};
