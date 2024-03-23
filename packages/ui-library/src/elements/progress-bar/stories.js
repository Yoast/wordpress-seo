import ProgressBar from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		min: 0,
		max: 100,
		progress: 50,
	},
};

export default {
	title: "1) Elements/Progress bar",
	component: ProgressBar,
	parameters: {
		docs: {
			description: { component },
			page: InteractiveDocsPage,
		},
	},
};
