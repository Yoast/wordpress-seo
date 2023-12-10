import React from "react";
import TextInput from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Text input",
	component: TextInput,
	parameters: {
		docs: {
			description: {
				component,
			},
		},
	},
};

export const Factory = {
	component: ( args ) => <TextInput { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};

export const DatePicker = StoryComponent.bind( {} );

DatePicker.parameters = {
	controls: { disable: false },
};

DatePicker.args = {
	type: "date",
};

DatePicker.storyName = "Date picker input";
