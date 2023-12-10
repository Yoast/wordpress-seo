import React from "react";
import Checkbox from ".";
import { component, disabled } from "./docs";

export default {
	title: "1) Elements/Checkbox",
	component: Checkbox,
	argTypes: {},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( args ) => (
	<Checkbox { ...args } />
);
Factory.parameters = {
	controls: { disabled: false },
};
Factory.args = {
	id: "checkbox",
	name: "name",
	value: "value",
	label: "I am a checkbox.",
	disabled: false,
};

export const Disabled = ( args ) => (
	<Checkbox { ...args } />
);
Disabled.parameters = {
	controls: { disable: true },
	docs: { description: { story: disabled } },
};
Disabled.args = {
	id: "checkbox-disabled",
	name: "name",
	value: "value",
	label: "I am a checkbox.",
	disabled: true,
};
