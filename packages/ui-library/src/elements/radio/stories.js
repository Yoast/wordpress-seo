import React from "react";
import Radio from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, dangerousLabel, variants } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "radio",
		name: "name",
		value: "value",
		label: "I am a radio button.",
	},
};

export const Variants = {
	render: ( args ) => (
		<div className="yst-flex yst-flex-col yst-gap-4">
			<div>Default variant:</div>
			<Radio id="radio-1" name="option-1" value="1" label="I am a radio button with default variant." />
			<hr />
			<div>Inline-block variant:</div>
			<Radio id="radio-2" name="option-2" value="2" screenReaderLabel="Option #2" label="2" variant="inline-block" />
		</div>
	),
	parameters: { docs: { description: { story: variants } } },
};

export const DangerousLabel = {
	name: "Dangerous label",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: dangerousLabel } },
	},
	args: {
		id: "radio-dangerous",
		name: "option-dangerous",
		value: "D",
		label: "&bull; Dangerous label.",
		isLabelDangerousHtml: true,
	},
};

export default {
	title: "1) Elements/Radio",
	component: Radio,
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Variants, DangerousLabel ] } />,
		},
	},
};
