import React from "react";
import Checkbox from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, disabled } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "checkbox",
		name: "name",
		value: "value",
		label: "I am a checkbox.",
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

export default {
	title: "1) Elements/Checkbox",
	component: Checkbox,
	argTypes: {},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Disabled ] } />,
		},
	},
};
