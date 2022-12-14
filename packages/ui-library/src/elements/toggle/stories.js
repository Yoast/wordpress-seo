import { noop } from "lodash";
import Toggle, { StoryComponent } from ".";

export default {
	title: "1) Elements/Toggle",
	component: StoryComponent,
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
	id: "id-1",
	screenReaderLabel: "Toggle",
	checked: false,
	onChange: noop,
};
