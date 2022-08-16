import { noop } from "lodash";
import FileInput from ".";

export default {
	title: "1. Elements/File Input",
	component: FileInput,
	argTypes: {},
	parameters: {
		docs: {
			description: {
				component: "A simple file input component with drop functionality.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<FileInput { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "file-input",
	name: "name",
	value: "",
	selectLabel: "Select label",
	dropLabel: "drag and drop label",
	screenReaderLabel: "Select a file",
	selectDescription: "File input description",
	isDisabled: false,
	onChange: noop,
};
