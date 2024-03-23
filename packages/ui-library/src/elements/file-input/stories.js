import { DesktopComputerIcon } from "@heroicons/react/outline";
import { noop } from "lodash";
import React from "react";
import FileInput from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, differentIcon, disabled, withDescription } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "factory",
		name: "factory",
	},
};

export const WithDescription = {
	name: "With description",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withDescription } },
	},
	args: {
		id: "with-description",
		name: "with-description",
		selectDescription: "File input description",
	},
};

export const Disabled = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: disabled } },
	},
	args: {
		id: "file-input-disabled",
		name: "disabled",
		selectDescription: "File input description",
		disabled: true,
	},
};

export const DifferentIcon = {
	name: "Different icon",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: differentIcon } },
	},
	args: {
		id: "icon-as",
		name: "icon-as",
		selectDescription: "File input description",
		iconAs: DesktopComputerIcon,
	},
};

export default {
	title: "1) Elements/File input",
	component: FileInput,
	argTypes: {
		value: { control: false },
		iconAs: { control: false },
	},
	args: {
		value: "",
		selectLabel: "Select label",
		dropLabel: "or drag and drop label",
		screenReaderLabel: "Select a file",
		onChange: noop,
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ WithDescription, Disabled, DifferentIcon ] } />,
		},
	},
};
