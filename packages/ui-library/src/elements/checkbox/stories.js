import Checkbox from ".";
import { component, disabled } from "./docs";

export default {
	title: "1) Elements/Checkbox",
	component: Checkbox,
	argTypes: {},
	parameters: { docs: { description: { component } } },
};

export const Factory = {
	parameters: {
		controls: { disabled: false },
	},
	args: {
		id: "checkbox",
		name: "name",
		value: "value",
		label: "I am a checkbox.",
		disabled: false,
	},
};

export const Disabled = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: disabled } },
	},
	args: {
		id: "checkbox-disabled",
		name: "name",
		value: "value",
		label: "I am a checkbox.",
		disabled: true,
	},
};
