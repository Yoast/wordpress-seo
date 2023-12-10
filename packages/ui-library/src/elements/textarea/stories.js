import React from "react";
import { StoryComponent } from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Textarea",
	component: StoryComponent,
	argTypes: {
		cols: {
			table: {
				defaultValue: { summary: 20 },
			},
		},
		rows: {
			table: {
				defaultValue: { summary: 2 },
			},
		},
	},
	parameters: {
		docs: {
			description: {
				component,
			},
		},
	},
};

export const Factory = {
	component: ( args ) => <StoryComponent { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};
