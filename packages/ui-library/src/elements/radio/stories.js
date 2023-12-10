import React from "react";
import { StoryComponent } from ".";
import { component, dangerousLabel, variants } from "./docs";

export default {
	title: "1) Elements/Radio",
	component: StoryComponent,
	parameters: { docs: { description: { component } } },
};

export const Factory = ( args ) => (
	<StoryComponent { ...args } />
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
		<div>Default variant:</div>
		<StoryComponent id="radio-1" name="option-1" value="1" label="I am a radio button with default variant." />
		<hr />
		<div>Inline-block variant:</div>
		<StoryComponent id="radio-2" name="option-2" value="2" screenReaderLabel="Option #2" label="2" variant="inline-block" />
	</div>
);
Variants.parameters = { docs: { description: { story: variants } } };

export const DangerousLabel = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-4">
		<StoryComponent id="radio-dangerous" name="option-dangerous" value="D" label={ "&bull; Dangerous label." } isLabelDangerousHtml={ true } />
	</div>
);
DangerousLabel.storyName = "Dangerous label";
DangerousLabel.parameters = { docs: { description: { story: dangerousLabel } } };
