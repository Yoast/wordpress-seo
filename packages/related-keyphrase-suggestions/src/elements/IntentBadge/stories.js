import React from "react";
import { IntentBadge } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		value: "i",
		id: "i",
	},
	argTypes: {
		value: {
			description: "Initial of the intent",
		},
	},
	render: ( args ) => (
		<>
			<IntentBadge { ...args } />
			<IntentBadge value="n" id="n" />
			<IntentBadge value="c" id="c" />
			<IntentBadge value="t" id="t" />
		</>
	),
};

export default {
	title: "2) Elements/IntentBadge",
	component: IntentBadge,
	args: {
		value: "i",
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-flex yst-gap-2 yst-justify-center yst-pt-14">
				<Story />
			</div>
		),
	],
};
