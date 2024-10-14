import TrendGraph from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		data: [
			{ x: 0, y: 20 },
			{ x: 1, y: 40 },
			{ x: 2, y: 30 },
			{ x: 3, y: 20 },
			{ x: 4, y: 40 },
			{ x: 5, y: 30 },
			{ x: 6, y: 20 },
			{ x: 7, y: 40 },
			{ x: 8, y: 30 },
			{ x: 9, y: 60 },
			{ x: 10, y: 30 },
			{ x: 11, y: 30 },
		],
	},
};

export default {
	title: "2) Elements/TrendGraph",
	component: TrendGraph,
	argTypes: {},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
