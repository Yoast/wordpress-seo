import TagInput from ".";

export default {
	title: "1. Elements/Tag Input",
	component: TagInput,
	parameters: {
		docs: {
			description: {
				component: "A simple tag input component.",
			},
		},
	},
	argTypes: {
		children: { control: false },
	},
	args: {
		tags: [
			"These are",
			"hopefully",
			"enough",
			"tags",
			"to show",
			"that",
			"this component",
			"will",
			"wrap around",
			"and",
			"continue",
			"on the next line.",
			"This is a longer tag that includes spaces!",
		],
	},
};

export const Factory = {
	component: ( args ) => <TagInput { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};
