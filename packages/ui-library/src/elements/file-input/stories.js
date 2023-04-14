import { noop } from "lodash";
import { StoryComponent } from ".";
import { DesktopComputerIcon } from "@heroicons/react/outline";

export default {
	title: "1) Elements/File input",
	component: StoryComponent,
	argTypes: {},
	parameters: {
		docs: {
			description: {
				component: "A simple file input component with drop functionality.",
			},
		},
	},
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
	docs: { description: { story: "A file input with a description using `selectDescription` prop." } },
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
	docs: { description: { story: "Disabled state using `disabled` prop." } },
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
	docs: { description: { story: "A file input with different icon using `iconAs` prop. The icon should be a React component." } },
};

DifferentIcon.args = {
	id: "icon-as",
	name: "icon-as",
	selectDescription: "File input description",
	disabled: false,
	iconAs: DesktopComputerIcon,
};
