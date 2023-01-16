import { StoryComponent } from ".";

export default {
	title: "1) Elements/Checkbox",
	component: StoryComponent,
	argTypes: {},
	parameters: {
		docs: {
			description: {
				component: "A simple checkbox component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<StoryComponent { ...args } />
);
Factory.parameters = {
	controls: { disabled: false },
};
Factory.args = {
	id: "checkbox",
	name: "name",
	value: "value",
	label: "I am a checkbox.",
	disabled: false,
};

export const Disabled = ( args ) => (
	<StoryComponent { ...args } />
);
Disabled.parameters = {
	controls: { disable: true },
};
Disabled.args = {
	id: "checkbox",
	name: "name",
	value: "value",
	label: "I am a checkbox.",
	disabled: true,
};
