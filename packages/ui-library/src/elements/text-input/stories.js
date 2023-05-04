// eslint-disable react/display-name
import { StoryComponent } from ".";

export default {
	title: "1) Elements/Text input",
	component: StoryComponent,
	parameters: {
		docs: {
			description: {
				component: "A simple text input component. Accept all props of a regular input element.",
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
