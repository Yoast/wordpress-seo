import { useCallback, useMemo, useState } from "@wordpress/element";
import { filter, find, includes, toLower } from "lodash";

import Autocomplete from ".";

export default {
	title: "1. Elements/Autocomplete",
	component: Autocomplete,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "span", "div" ] },
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
				{ ...args }
				value={ value }
				selectedLabel={ selectedOption?.label || "" }
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
	id: "autocomplete",
	value: "",
};

export const WithError = Template.bind( {} );

WithError.parameters = {
	controls: { disable: false },
};
WithError.args = {
	id: "autocomplete",
	value: "",
	label: "Auto complete with error and label",
	isError: true,
};

export const WithPlaceholder = Template.bind( {} );

WithPlaceholder.parameters = {
	controls: { disable: false },
};

WithPlaceholder.args = {
	id: "autocomplete",
	value: "",
	placeholder: "Search a value...",
};
