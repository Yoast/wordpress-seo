import Label from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		label: "Label factory",
	},
};

export default {
	title: "1) Elements/Label",
	component: Label,
	argTypes: {
		as: { options: [ "label", "span", "div" ] },
	},
	parameters: {
		docs: {
			description: { component },
			page: InteractiveDocsPage,
		},
	},
};
