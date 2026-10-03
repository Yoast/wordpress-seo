import React from "react";
import TextInput from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";

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

export default {
	title: "1) Elements/Text input",
	component: TextInput,
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ DatePicker ] } />,
		},
	},
};
