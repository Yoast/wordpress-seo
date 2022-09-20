import { useCallback, useState } from "@wordpress/element";
import { Badge, SelectField } from "../../index";

export default {
	title: "2. Components/Select Field",
	component: SelectField,
	argTypes: {
		error: { control: "text" },
		children: { description: "Alternative to options." },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple select field component.",
			},
		},
	},
};

const Template = ( args ) => {
	const [ value, setValues ] = useState( args.value || "" );
	const handleChange = useCallback( setValues, [ setValues ] );

	return (
		// Min height to make room for options dropdown.
		<div style={ { minHeight: 200 } }>
			<SelectField { ...args } value={ value } onChange={ handleChange } />
		</div>
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "select-field",
	name: "name",
	value: "1",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
	label: "A Select Field",
};

export const WithLabelAndDescription = Template.bind( {} );
WithLabelAndDescription.args = {
	id: "select-field-1",
	name: "name-1",
	label: "Select field with a label",
	description: "Select field with a description.",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

export const WithError = Template.bind( {} );
WithError.args = {
	id: "select-field-2",
	name: "name-2",
	value: "2",
	label: "Select field with a label",
	error: "Select field with an error.",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};


export const WithLabelSuffix = Template.bind( {} );
WithLabelSuffix.args = {
	id: "select-field-3",
	name: "name-3",
	value: "3",
	label: "Select field with a label suffix",
	labelSuffix: <Badge className="yst-ml-1.5" size="small">Beta</Badge>,
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

