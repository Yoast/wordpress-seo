import React from "react";
import { UserMessage } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	render: ( args ) => <UserMessage { ...args } />,
};

export default {
	title: "2) Elements/UserMessage",
	component: UserMessage,
	args: {
		variant: "requestLimitReached",
		upsellLink: "https://www.semrush.com/analytics/keywordoverview/?q=example&db=us",
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
