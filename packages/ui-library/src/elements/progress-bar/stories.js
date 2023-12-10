import React from "react";
import { StoryComponent } from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Progress bar",
	component: StoryComponent,
	parameters: { docs: { description: { component } } },
};

export const Factory = ( { children, ...args } ) => (
	<StoryComponent { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	min: 0,
	max: 100,
	progress: 50,
};
