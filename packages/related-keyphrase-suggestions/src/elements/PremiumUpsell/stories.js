import React from "react";
import { PremiumUpsell } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		url: "https://yoast.com",
	},
	render: ( args ) => (
		<PremiumUpsell { ...args } />
	),
};

export default {
	title: "2) Elements/PremiumUpsell",
	component: PremiumUpsell,
	args: {
		url: "https://yoast.com",
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
