import { map, noop } from "lodash";
import React, { useCallback, useState } from "react";
import SelectField from ".";
import { VALIDATION_VARIANTS } from "../../constants";
import { Badge } from "../../index";

const options = [
	{ value: "1", label: "Option 1" },
	{ value: "2", label: "Option 2" },
	{ value: "3", label: "Option 3" },
	{ value: "4", label: "Option 4" },
];

export default {
	title: "2) Components/Select field",
	component: SelectField,
	argTypes: {
		description: { control: "text" },
		children: { description: "Alternative to options.", control: "text" },
		labelSuffix: { control: "text" },
	},
	args: {
		options: options,
	},
	parameters: {
		docs: {
			description: {
				component: "A simple select field component that extends select element.",
			},
		},
	},
};


const Template = ( args ) => {
	const [ value, setValue ] = useState( args.value || "" );
	const [ selectedLabel, setSelectedLabel ] = useState( value ? args.options.find( option => option.value === value ).label : "" );
	const handleChange = useCallback( ( val ) => {
		const selected = args.options.find( option => option.value === val );
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
	label: "A select field",
};

export const WithLabelAndDescription = Template.bind( {} );
WithLabelAndDescription.storyName = "With label and description";
WithLabelAndDescription.args = {
	id: "select-field-1",
	name: "name-1",
	value: "3",
	label: "Select field with a label",
	description: "Select field with a description.",
	children: options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
};

export const WithError = Template.bind( {} );
WithError.storyName = "With error";
WithError.args = {
	id: "select-field-2",
	name: "name-2",
	value: "2",
	label: "Select field with a label",
	error: "Select field with an error.",
};


export const WithLabelSuffix = Template.bind( {} );
WithLabelSuffix.storyName = "With label suffix";
WithLabelSuffix.args = {
	id: "select-field-3",
	name: "name-3",
	value: "3",
	label: "Select field with a label suffix",
	labelSuffix: <Badge className="yst-ml-1.5" size="small">Beta</Badge>,
};

export const OptionsProp = Template.bind( {} );
OptionsProp.storyName = "Options prop";
OptionsProp.args = {
	id: "select-field-4",
	name: "name-4",
	value: "3",
	label: "Select field with a options as array",
};

OptionsProp.parameters = {
	docs: { description: { story: "Add options as an array of objects with `options` prop. Each object must contain `value` and `label` parameters. The displayed selected label will be updated automatically on change." } },
};

export const SelectFieldOption = Template.bind( {} );
SelectFieldOption.storyName = "Select field option";
SelectFieldOption.args = {
	id: "select-field-5",
	name: "name-5",
	value: "3",
	label: "Select field with options as exposed React components",
	children: options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
};

SelectFieldOption.parameters = {
	docs: { description: { story: "Add options as an array of React components with `children` prop, using the exposed option component `SelectField.Option`. In this case changing the `selectedLabel` should be done manually in the handleChange function." } },
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<SelectField
				key={ variant }
				id={ `validation-${ variant }` }
				name={ `validation-${ variant }` }
				label={ `With validation of variant ${ variant }` }
				value="The quick brown fox jumps over the lazy dog"
				onChange={ noop }
				options={ [
					{ value: "1", label: "Option 1" },
					{ value: "2", label: "Option 2" },
					{ value: "3", label: "Option 3" },
					{ value: "4", label: "Option 4" },
				] }
				validation={ {
					variant,
					message: {
						success: "Looks like you are nailing it!",
						warning: "Looks like you could do better!",
						info: <>Looks like you could use some <a href="https://yoast.com" target="_blank" rel="noreferrer">more info</a>!</>,
						error: "Looks like you are doing it wrong!",
					}[ variant ],
				} }
			/>
		) ) }
	</div>
);
