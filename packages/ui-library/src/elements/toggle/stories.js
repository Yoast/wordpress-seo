import { noop } from "lodash";
import Toggle from ".";

export default {
	title: "1. Elements/Toggle",
	component: Toggle,
	argTypes: {
		as: { options: [ "button", "div", "span" ] },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple toggle component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<Toggle { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	srLabel: "Toggle",
	onChange: noop,
};
