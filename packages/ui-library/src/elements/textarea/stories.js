import Textarea, { StoryComponent } from ".";

export default {
	title: "1) Elements/Textarea",
	component: StoryComponent,
	argTypes: {
		cols: {
			table: {
				defaultValue: { summary: 20 },
			},
		},
		rows: {
			table: {
				defaultValue: { summary: 2 },
			},
		},
	},
	parameters: {
		docs: {
			description: {
				component: "A simple textarea component.",
			},
		},
	},
};

export const Factory = {
	component: ( args ) => <Textarea { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};
