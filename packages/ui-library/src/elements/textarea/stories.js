import Textarea from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
};

export default {
	title: "1) Elements/Textarea",
	component: Textarea,
	parameters: {
		docs: {
			description: { component },
			page: InteractiveDocsPage,
		},
	},
};
