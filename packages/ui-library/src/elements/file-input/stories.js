import { DesktopComputerIcon } from "@heroicons/react/outline";
import { noop } from "lodash";
import React from "react";
import { StoryComponent } from ".";
import { component, differentIcon, disabled, withDescription } from "./docs";

export default {
	title: "1) Elements/File input",
	component: StoryComponent,
	argTypes: {},
	parameters: { docs: { description: { component } } },
};

const Template = ( args ) => <StoryComponent
	value=""
	selectLabel="Select label"
	dropLabel="or drag and drop label"
	screenReaderLabel="Select a file"
	onChange={ noop }
	{ ...args }
/>;

export const Factory = Template.bind( {} );

Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "factory",
	name: "factory",
	disabled: false,
};

export const WithDescription = Template.bind( {} );

WithDescription.storyName = "With description";

WithDescription.parameters = {
	controls: { disable: false },
	docs: { description: { story: withDescription } },
};

WithDescription.args = {
	id: "with-description",
	name: "with-description",
	selectDescription: "File input description",
	disabled: false,
};

export const Disabled = Template.bind( {} );

Disabled.parameters = {
	controls: { disable: true },
	docs: { description: { story: disabled } },
};

Disabled.args = {
	id: "file-input-disabled",
	name: "disabled",
	selectDescription: "File input description",
	disabled: true,
};

export const DifferentIcon = Template.bind( {} );
DifferentIcon.storyName = "Different icon";
DifferentIcon.parameters = {
	controls: { disable: false },
	docs: { description: { story: differentIcon } },
};

DifferentIcon.args = {
	id: "icon-as",
	name: "icon-as",
	selectDescription: "File input description",
	disabled: false,
	iconAs: DesktopComputerIcon,
};
