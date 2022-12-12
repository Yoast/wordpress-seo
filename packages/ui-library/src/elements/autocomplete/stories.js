import { useCallback, useMemo, useState } from "@wordpress/element";
import { filter, find, includes, toLower } from "lodash";
import Autocomplete from ".";

export default {
	title: "1) Elements/Autocomplete",
	component: Autocomplete,
	argTypes: {
		children: { control: "text" },
		labelSuffix: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple autocomplete select component.",
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

const Template = ( args ) => {
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
			<Autocomplete
				selectedLabel={ selectedOption?.label || "" }
				{ ...args }
				value={ value }
				onChange={ handleChange }
				onQueryChange={ handleQueryChange }
			>
				{ filteredOptions.map( option => (
					<Autocomplete.Option key={ option.value } value={ option.value }>
						{ option.label }
					</Autocomplete.Option>
				) ) }
			</Autocomplete>
		</div>
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	id: "factory",
	value: "",
	placeholder: "Type to autocomplete options",
};

export const WithLabel = Template.bind( {} );

WithLabel.parameters = {
	controls: { disable: false },
	docs: { description: { story: "An example with a label using `label` prop." } },
};

WithLabel.args = {
	id: "with-label",
	value: "",
	label: "Example label",
};

export const WithError = Template.bind( {} );

WithError.parameters = {
	controls: { disable: false },
	docs: { description: { story: "An exampe with error using `isError` prop." } },
};
WithError.args = {
	id: "with-error",
	value: "",
	label: "Example label",
	labelProps: { className: "yoast-field-group__label" },
	isError: true,
};

export const WithPlaceholder = Template.bind( {} );

WithPlaceholder.parameters = {
	controls: { disable: false },
	docs: { description: { story: "An example with placeholder using `placeholder` prop." } },
};

WithPlaceholder.args = {
	id: "with-placeholder",
	value: "",
	placeholder: "Search a value...",
};

export const WithSelectedLabel = Template.bind( {} );

WithSelectedLabel.parameters = {
	controls: { disable: false },
	docs: { description: { story: "An example with default value using `selectedLabel` prop." } },
};

WithSelectedLabel.args = {
	value: "option-1",
	id: "selected-label",
	selectedLabel: "Option 1",
};
