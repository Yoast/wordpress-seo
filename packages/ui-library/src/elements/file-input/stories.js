import { DesktopComputerIcon } from "@heroicons/react/outline";
import { noop } from "lodash";
import FileInput from ".";
import { component, differentIcon, disabled, withDescription } from "./docs";

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
	parameters: { docs: { description: { component } } },
};

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
