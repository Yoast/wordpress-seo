import { filter, find, includes, map, noop, toLower } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import Autocomplete from ".";
import { VALIDATION_VARIANTS } from "../../constants";
import { component, validation, withLabel, withPlaceholder, withSelectedLabel } from "./docs";

export default {
	title: "1) Elements/Autocomplete",
	component: Autocomplete,
	argTypes: {
		children: { control: "text" },
		labelSuffix: { control: "text" },
		nullable: { control: "boolean" },
	},
	parameters: {
		docs: {
			description: {
				component,
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

WithLabel.storyName = "With label";

WithLabel.parameters = {
	controls: { disable: false },
	docs: { description: { story: withLabel } },
};

WithLabel.args = {
	id: "with-label",
	value: "",
	label: "Example label",
};

export const Nullable = Template.bind( {} );

Nullable.storyName = "Nullable";

Nullable.parameters = {
	controls: { disable: false },
	docs: { description: { story: "Allow empty values with reset button `X` or deleting the option and clicking outside the field." } },
};

Nullable.args = {
	id: "with-label",
	value: "",
	label: "Example label",
	nullable: true,
	placeholder: "None...",
};

export const WithPlaceholder = Template.bind( {} );

WithPlaceholder.storyName = "With placeholder";

WithPlaceholder.parameters = {
	controls: { disable: false },
	docs: { description: { story: withPlaceholder } },
};

WithPlaceholder.args = {
	id: "with-placeholder",
	value: "",
	placeholder: "Search a value...",
};

export const WithSelectedLabel = Template.bind( {} );

WithSelectedLabel.storyName = "With selected label";

WithSelectedLabel.parameters = {
	controls: { disable: false },
	docs: { description: { story: withSelectedLabel } },
};

WithSelectedLabel.args = {
	value: "option-1",
	id: "selected-label",
	selectedLabel: "Option 1",
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<Autocomplete
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

Validation.parameters = { docs: { description: { story: validation } } };
