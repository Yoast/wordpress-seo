import Textarea from ".";

export default {
	title: "1. Elements/Textarea",
	component: Textarea,
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

export const RowsAndCols = {
	component: Factory.component.bind( {} ),
	args: {
		rows: 20,
		cols: 100,
		defaultValue: "Including a default value.",
	},
};
