import React from "react";
import { IntentBadge } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		value: "i",
	},
	argTypes: {
		value: {
			description: "Initial of the intent",
		},
	},
	render: ( { value } ) => (
		<>
			<IntentBadge value={ value } />
			<IntentBadge value="n" />
			<IntentBadge value="c" />
			<IntentBadge value="t" />
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
