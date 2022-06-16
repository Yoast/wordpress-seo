import FileInput from ".";

export default {
	title: "1. Elements/FileInput",
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
	id: "file-inpit",
	name: "name",
	value: "value",
	label: "I am a file input with drop functionality.",
};
