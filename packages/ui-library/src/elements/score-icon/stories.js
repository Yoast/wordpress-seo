import ScoreIcon from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		score: "good",
	},
};

export default {
	title: "1) Elements/ScoreIcon",
	component: ScoreIcon,
	argTypes: {
		score: {
			control: { type: "select" },
			options: [ "good", "bad", "ok", "na", "invalid score" ],
			description: "The score to display, can be 'good', 'bad', 'ok', 'na'. Invalid score falls back to 'na'.",
			table: { type: { summary: "string" } },
		},
		isEmoji: {
			control: { type: "boolean" },
			description: "A flag to indicate if the score should be displayed as an emoji.",
			table: { type: { summary: "boolean" }, defaultValue: { summary: "true" } },
		},
		className: {
			control: { type: "text" },
			description: "A class name to apply to the component.",
			table: { type: { summary: "string" } },
		},
	},
	parameters: {
		docs: {
			description: { component },
			page: InteractiveDocsPage,
		},
	},
};
