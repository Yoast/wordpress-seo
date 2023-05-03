import { StoryComponent } from ".";

export default {
	title: "1) Elements/Label",
	component: StoryComponent,
	argTypes: {
		as: { options: [ "label", "span", "div" ] },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple label component.",
			},
		},
	},
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
