import React from "react";
import { StoryComponent } from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Label",
	component: StoryComponent,
	argTypes: {
		as: { options: [ "label", "span", "div" ] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( { ...args } ) => (
	<StoryComponent { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	label: "Label factory",
};
