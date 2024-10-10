import CountrySelector from ".";
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
	argTypes: {
		countryCode: "text",
		activeCountryCode: "text",
		onChange: "function",
		onSelect: "function",
	},
};

export default {
	title: "1) Components/CountrySelector",
	component: CountrySelector,
	argTypes: {
		countryCode: "text",
		activeCountryCode: "text",
		onChange: "function",
		onSelect: "function",
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
