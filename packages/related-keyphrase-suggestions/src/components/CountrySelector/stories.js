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
		onSelect: noop,
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
};
