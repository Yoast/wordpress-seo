import AutocompleteField from ".";
import { useCallback, useMemo, useState } from "@wordpress/element";
import { filter, find, includes, toLower } from "lodash";

export default {
	title: "2. Components/Autocomplete Field",
	component: AutocompleteField,
	argTypes: {
		description: { control: "text" },
		error: { control: "text" },
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

export const WithError = Template.bind( {} );

WithError.parameters = {
	controls: { disable: false },
	docs: { description: { story: "An exampe with error message using `error` prop." } },
};

WithError.args = {
	id: "with-error",
	name: "with-error",
	label: "Example label",
	labelProps: { className: "yoast-field-group__label" },
	isError: true,
	error: "This is an error message",
};

export const WithDescription = Template.bind( {} );

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


