import { TrendGraph } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		data: [ 20, 40, 30, 20, 40, 30, 20, 40, 30, 60, 30, 30 ],
	},
};

export default {
	title: "2) Elements/TrendGraph",
	component: TrendGraph,
	parameters: {
		docs: {
			description: { component },
		},
	},
};
