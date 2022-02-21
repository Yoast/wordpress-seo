import Radio from ".";

export default {
	title: "1. Elements/Radio",
	component: Radio,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple radio component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<Radio { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "radio",
	name: "name",
	value: "value",
	label: "I am a radio button.",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<Radio id="radio-1" name="name" value="1">I am a radio button.</Radio>
		<hr />
		<Radio id="radio-2" name="name" value="2" variant="inline-block">Y</Radio>
	</div>
);
