import React from "react";
import { IntentBadge } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		initial: "i",
	},
	argTypes: {
		initial: {
			description: "Initial of the intent",
		},
	},
	render: ( { initial } ) => (
		<>
			<IntentBadge initial={ initial } />
			<IntentBadge initial="n" />
			<IntentBadge initial="c" />
			<IntentBadge initial="t" />
		</>
	),
};

export default {
	title: "2) Elements/IntentBadge",
	component: IntentBadge,
	args: {
		initial: "i",
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
