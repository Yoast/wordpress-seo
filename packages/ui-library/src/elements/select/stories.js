import { useCallback, useState } from "@wordpress/element";
import Select from ".";

export default {
	title: "1) Elements/Select",
	component: Select,
	argTypes: {
		children: { control: "text" },
		labelSuffix: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple select component.",
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
			<Select { ...args } value={ value } onChange={ handleChange } selectedLabel={ selectedLabel } />
		</div>
	);
};


export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
	actions: { disable: false },
};
Factory.args = {
	id: "select",
	value: "1",
	selectedLabel: "Option 1",
	children: options.map( option => <Select.Option key={ option.value } { ...option } /> ),

};

export const States = Template.bind( {} );
States.args = {
	id: "select",
	value: "1",
	isError: true,
	children: options.map( option => <Select.Option key={ option.value } { ...option } /> ),
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
	children: options.map( option => <Select.Option key={ option.value } { ...option } /> ),
};

ChildrenProp.parameters = {
	docs: { description: { story: "Add options as an array of React components with `children` prop, using the exposed option component `Select.Option`. In this case changing the `selectedLabel` should be done manually in the handleChange function" } },
};
