import React from "react";
import IntentBadge from ".";
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
			control: {
				type: "string",
			},
		},
	},
	render: ( { initial } ) => (
		<div className="yst-flex yst-gap-2 yst-justify-center yst-pt-14">
			<IntentBadge initial={ initial } />
			<IntentBadge initial="n" />
			<IntentBadge initial="c" />
			<IntentBadge initial="t" />
		</div>
	),
};

export default {
	title: "2) Elements/IntentBadge",
	component: IntentBadge,
	argTypes: {
		initial: "text",
	},
	args: {
		initial: "i",
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
