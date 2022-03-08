import TextareaField from ".";

export default {
	title: "2. Components/Textarea Field",
	component: TextareaField,
	argTypes: {
		label: { control: "text" },
		description: { control: "text" },
		error: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple textarea field component.",
			},
		},
	},
	args: {
		id: "textarea-field",
	},
};

export const Factory = {
	component: args => <TextareaField { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};

export const WithLabelAndDescription = {
	component: Factory.component.bind( {} ),
	args: {
		id: "textarea-field-1",
		label: "Textarea field with a label",
		description: "Textarea field with a description.",
	},
};

export const WithError = {
	component: Factory.component.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "textarea-field-2",
		label: "Textarea field with a label",
		description: "Textarea field with a description.",
		error: "Please enter a valid text.",
	},
};
