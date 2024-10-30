import React from "react";
import { CountrySelector } from ".";
import { component } from "./docs";
import { noop } from "lodash";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		countryCode: "us",
		activeCountryCode: "us",
		onChange: noop,
		onClick: noop,
		className: "",
	},
};

export default {
	title: "1) Components/CountrySelector",
	component: CountrySelector,
	parameters: {
		docs: {
			description: { component },
		},
	},
	decorators: [
		( Story ) => (
			// Min height to make room for options dropdown.
			<div className="yst-min-h-[300px]">
				<Story />
			</div>
		),
	],
};
