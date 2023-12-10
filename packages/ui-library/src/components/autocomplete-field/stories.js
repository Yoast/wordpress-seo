import { filter, find, includes, map, noop, toLower } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import AutocompleteField from ".";
import { VALIDATION_VARIANTS } from "../../constants";

export default {
	title: "2) Components/Autocomplete field",
	component: AutocompleteField,
	argTypes: {
		description: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple autocomplete select component with error message and description message.",
			},
		},
	},
};

const dummyOptions = [
	{
		value: "option-1",
		label: "Option 1",
	}, {
		value: "option-2",
		label: "Option 2",
	}, {
		value: "option-3",
		label: "Option 3",
	},
];

const Template = ( { ...args } ) => {
	const [ value, setValue ] = useState( "" );
	const [ query, setQuery ] = useState( "" );
	const selectedOption = useMemo( () => find( dummyOptions, [ "value", value ] ), [ value ] );
	const filteredOptions = useMemo( () => filter( dummyOptions, option => query
		? includes( toLower( option.label ), toLower( query ) )
		: true ), [ query ] );

	const handleChange = useCallback( setValue, [ setValue ] );
	const handleQueryChange = useCallback( event => setQuery( event.target.value ), [ setQuery ] );

	return (
		// Min height to make room for options dropdown.
		<div style={ { minHeight: 200 } }>
			<AutocompleteField
				selectedLabel={ selectedOption?.label || "" }
				{ ...args }
				value={ value }
				onChange={ handleChange }
				onQueryChange={ handleQueryChange }
			>
				{ filteredOptions.map( option => (
					<AutocompleteField.Option key={ option.value } value={ option.value }>
						{ option.label }
					</AutocompleteField.Option>
				) ) }
			</AutocompleteField>
		</div>
	);
};


export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "factory",
	name: "factory",
	label: "Autocomplete field label",
	description: "Autocomplete field description",
	placeholder: "Search an option...",
};

export const WithDescription = Template.bind( {} );
WithDescription.storyName = "With description";
WithDescription.parameters = {
	controls: { disable: false },
	docs: { description: { story: "An exampe with description message using `description`." } },
};
WithDescription.args = {
	id: "with-description",
	name: "with-description",
	label: "Example label",
	description: "This is a description message",
};

export const WithSelectedLabel = Template.bind( {} );
WithSelectedLabel.storyName = "With selected label";
WithSelectedLabel.parameters = {
	controls: { disable: false },
	docs: { description: { story: "When using `children` prop, `selectedLabel` prop is used to set default/selected value." } },
};

WithSelectedLabel.args = {
	id: "selected-label",
	name: "selected-label",
	label: "Example label",
	selectedLabel: "Option 1",
	children: <>
		<AutocompleteField.Option value="child 1" label="Option 1" id="option-1" name="option-1" />
		<AutocompleteField.Option value="child 2" label="Option 2" id="option-2" name="option-2" />
		<AutocompleteField.Option value="child 3" label="Option 3" id="option-3" name="option-3" />
	</>,
};

export const WithPlaceholder = Template.bind( {} );
WithPlaceholder.storyName = "With placeholder";
WithPlaceholder.parameters = {
	controls: { disable: false },
	docs: { description: { story: "An example with placeholder." } },
};

WithPlaceholder.args = {
	id: "with-placeholder",
	name: "with-placeholder",
	label: "Example label",
	placeholder: "Search a value...",
};

export const ChildrenProp = Template.bind();
ChildrenProp.storyName = "Children prop";
ChildrenProp.args = {
	id: "with-children-prop",
	name: "with-children-prop",
	label: "Example label",
	children: <>
		<AutocompleteField.Option value="child 1" label="Option 1" id="option-1" name="option-1" />
		<AutocompleteField.Option value="child 2" label="Option 2" id="option-2" name="option-2" />
		<AutocompleteField.Option value="child 3" label="Option 3" id="option-3" name="option-3" />
	</>,
};

ChildrenProp.parameters = { docs: { description: { story: "The `children` prop can be used to render custom content. The options are rendered using the sub component `Option` (`AutocompleteField.Option` is equal to `Autocomplete` element). Default values should be set inside the child component and not the `selectedLabel` prop." } } };

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<AutocompleteField
				key={ variant }
				id={ `validation-${ variant }` }
				name={ `validation-${ variant }` }
				label={ `With validation of variant ${ variant }` }
				value="1"
				selectedLabel="The quick brown fox jumps over the lazy dog"
				onChange={ noop }
				onQueryChange={ noop }
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
