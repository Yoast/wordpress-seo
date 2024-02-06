import { StoryComponent } from ".";
import { component, variants } from "./docs";

export default {
	title: "1) Elements/Tooltip",
	component: StoryComponent,
	argTypes: {
		children: { control: "message" },
		as: { options: [ "span", "div" ] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( { children, ...args } ) => (
	<StoryComponent { ...args } />
);

Factory.parameters = {
	controls: { disable: false },
};

Factory.args = {
	children: "Tooltip factory",
};


export const Variants = ( args ) => (
	<div className="" />
);
Variants.parameters = { docs: { description: { story: variants } } };
