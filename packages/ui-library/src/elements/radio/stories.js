import Radio from ".";

export default {
	title: "1. Elements/Radio",
	component: Radio,
	argTypes: {},
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
	label: "&bull; I am a radio button.",
	isLabelDangerousHtml: true,
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<Radio id="radio-1" name="name" value="1" label="I am a radio button." />
		<hr />
		<Radio id="radio-a" name="name" value="A" screenReaderLabel="Option #A" label="A" variant="inline-block" />
		<Radio id="radio-b" name="name" value="B" screenReaderLabel="Option #B" label="B" variant="inline-block" />
		<hr />
		<Radio
			id="radio-3"
			name="name"
			value="&bull;"
			screenReaderLabel="Option bullet"
			label={ "&bull; This Radio has `isLabelDangerousHtml` prop set to true, the bullet is encoded." }
			isLabelDangerousHtml={ true }
			// variant="inline-block"
		/>
	</div>
);
Variants.parameters = {
	docs: { description: { story: "In the `inline-block` variant, the `screenReaderLabel` prop is used to provide screen readers with a useful label." } },
};
