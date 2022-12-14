import { noop } from "lodash";
import { StoryComponent } from ".";

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
	<StoryComponent { ...args } />
);

Factory.parameters = {
	controls: { disable: false },
};

Factory.args = {
	screenReaderLabel: "Toggle",
	checked: false,
	onChange: noop,
};
