import { map, noop } from "lodash";
import React, { useCallback, useState } from "react";
import Select from ".";
import { VALIDATION_VARIANTS } from "../validation/constants";
import { childrenProp, component, optionsProp, validation } from "./docs";

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
				component,
			},
		},
	},
	decorators: [
		( Story ) => (
			// Min height to make room for options dropdown.
			<div style={ { minHeight: 200 } }>
				<Story />
			</div>
		),
	],
};

const OPTIONS = [
	{ value: "1", label: "Option 1" },
	{ value: "2", label: "Option 2" },
	{ value: "3", label: "Option 3" },
	{ value: "4", label: "Option 4" },
];

const Template = ( args ) => {
	const [ value, setValue ] = useState( args.value || "" );
	const [ selectedLabel, setSelectedLabel ] = useState( value ? OPTIONS.find( option => option.value === value ).label : "" );
	const handleChange = useCallback( ( val ) => {
		const selected = OPTIONS.find( option => option.value === val );
		setSelectedLabel( selected.label );
		setValue( val );
	}, [ setValue ] );

	return (
		<Select { ...args } value={ value } onChange={ handleChange } selectedLabel={ selectedLabel } />
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
		actions: { disable: false },
	},
	args: {
		id: "select",
		value: "1",
		selectedLabel: "Option 1",
		children: OPTIONS.map( option => <Select.Option key={ option.value } { ...option } /> ),
	},
};

export const OptionsProp = {
	render: Template.bind( {} ),
	name: "Options prop",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: optionsProp } },
	},
	args: {
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
	},
};

export const ChildrenProp = {
	render: Template.bind( {} ),
	name: "Children prop",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: childrenProp } },
	},
	args: {
		id: "select-field-5",
		name: "name-5",
		value: "3",
		label: "Select field with options as exposed React components",
		children: OPTIONS.map( option => <Select.Option key={ option.value } { ...option } /> ),
	},
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<Select
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
Validation.parameters = { docs: { description: { story: validation } } };
