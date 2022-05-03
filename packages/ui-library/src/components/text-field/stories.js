import { useCallback, useState } from "@wordpress/element";
import { noop } from "lodash";
import InputField from ".";

export default {
	title: "2. Components/Text Field",
	component: InputField,
	argTypes: {
		description: { control: "text" },
		error: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple input field component.",
			},
		},
	},
	args: {
		id: "input-field",
		onChange: noop,
		label: "A Text Field",
	},
};

export const Factory = {
	component: args => {
		const [ value, setValue ] = useState( args.value || "" );
		const handleChange = useCallback( setValue, [ setValue ] );

		return (
			<InputField { ...args } value={ value } onChange={ handleChange } />
		);
	},
	parameters: {
		controls: { disable: false },
	},
};

export const WithLabelAndDescription = {
	component: Factory.component.bind( {} ),
	args: {
		id: "input-field-1",
		label: "Input field with a label",
		description: "Input field with a description.",
	},
};

export const WithError = {
	component: Factory.component.bind( {} ),
	args: {
		id: "input-field-2",
		label: "Input field with a label",
		description: "Input field with a description.",
		type: "email",
		error: "Please enter a valid email address.",
	},
};
