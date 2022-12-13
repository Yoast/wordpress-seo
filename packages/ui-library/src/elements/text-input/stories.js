import TextInput, { StoryComponent } from ".";

export default {
	title: "1. Elements/Text Input",
	component: StoryComponent,
	parameters: {
		docs: {
			description: {
				component: "A simple text input component.",
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
