import Textarea from ".";

export default {
	title: "1. Elements/Textarea",
	component: Textarea,
	argTypes: {
		cols: { defaultValue: 20 },
		rows: { defaultValue: 2 },
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
