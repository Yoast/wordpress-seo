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

const options = [
	{ value: "1", label: "Option 1" },
	{ value: "2", label: "Option 2" },
	{ value: "3", label: "Option 3" },
	{ value: "4", label: "Option 4" },
];

const Template = ( args ) => {
	const [ value, setValue ] = useState( args.value || "" );
	const [ selectedLabel, setSelectedLabel ] = useState( value ? options.find( option => option.value === value ).label : "" );
	const handleChange = useCallback( ( val ) => {
		const selected = options.find( option => option.value === val );
		setSelectedLabel( selected.label );
		setValue( val );
	}, [ setValue ] );

	return (
		// Min height to make room for options dropdown.
		<div style={ { minHeight: 200 } }>
			<SelectField { ...args } value={ value } onChange={ handleChange } selectedLabel={ selectedLabel } />

		</div>
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "select-field-0",
	name: "name-0",
	value: "1",
	children: options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
	label: "A Select Field",
};

export const WithLabelAndDescription = Template.bind( {} );
WithLabelAndDescription.args = {
	id: "select-field-1",
	name: "name-1",
	value: "3",
	label: "Select field with a label",
	description: "Select field with a description.",
	children: options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
};

export const WithError = Template.bind( {} );
WithError.args = {
	id: "select-field-2",
	name: "name-2",
	value: "2",
	label: "Select field with a label",
	error: "Select field with an error.",
	children: options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
};


export const WithLabelSuffix = Template.bind( {} );
WithLabelSuffix.args = {
	id: "select-field-3",
	name: "name-3",
	value: "3",
	label: "Select field with a label suffix",
	labelSuffix: <Badge className="yst-ml-1.5" size="small">Beta</Badge>,
	children: options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
};

export const OptionsProp = Template.bind( {} );
OptionsProp.args = {
	id: "select-field-4",
	name: "name-4",
	value: "3",
	label: "Select field with a options as array",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

OptionsProp.parameters = {
	docs: { description: { story: "Add options as an array of objects with `options` prop. Each object must contain `value` and `label` parameters. The displayed selected label will be updated automatically on change." } },
};

export const ChildrenProp = Template.bind( {} );
ChildrenProp.args = {
	id: "select-field-5",
	name: "name-5",
	value: "3",
	label: "Select field with options as exposed React components",
	children: options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
};

ChildrenProp.parameters = {
	docs: { description: { story: "Add options as an array of React components with `children` prop, using the exposed option component `SelectField.Option`. In this case changing the `selectedLabel` should be done manually in the handleChange function" } },
};
