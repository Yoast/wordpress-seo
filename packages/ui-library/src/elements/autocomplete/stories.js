import { useArgs } from "@storybook/preview-api";
import { filter, find, includes, map, noop, toLower } from "lodash";
import React, { useCallback, useMemo } from "react";
import Autocomplete from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { VALIDATION_VARIANTS } from "../../constants";
import { component, validation, withLabel, withNullable, withPlaceholder, withSelectedLabel } from "./docs";

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
	const [ { value, query }, updateArgs ] = useArgs();
	const selectedOption = useMemo( () => find( dummyOptions, [ "value", value ] ), [ value ] );
	const filteredOptions = useMemo( () => filter( dummyOptions, option => query
		? includes( toLower( option.label ), toLower( query ) )
		: true ), [ query ] );

	const handleChange = useCallback( newValue => updateArgs( { value: newValue } ), [ updateArgs ] );
	const handleQueryChange = useCallback( event => updateArgs( { query: event.target.value } ), [ updateArgs ] );

	return (
		<Autocomplete
			{ ...args }
			selectedLabel={ args?.selectedLabel || selectedOption?.label || "" }
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
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "factory",
		value: "",
		placeholder: "Type to autocomplete options",
	},
};

export const WithLabel = {
	render: Template.bind( {} ),
	name: "With label",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withLabel } },
	},
	args: {
		id: "with-label",
		label: "Example label",
	},
};

export const Nullable = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withNullable } },
	},
	args: {
		id: "nullable",
		value: dummyOptions[ 0 ].value,
		placeholder: "Type to autocomplete options",
		nullable: true,
		clearButtonScreenReaderText: "Clear selection",
	},
};

export const WithPlaceholder = {
	render: Template.bind( {} ),
	name: "With placeholder",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withPlaceholder } },
	},
	args: {
		id: "with-placeholder",
		value: "",
		placeholder: "Search a value...",
	},
};

export const WithSelectedLabel = {
	render: Template.bind( {} ),
	name: "With selected label",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withSelectedLabel } },
	},
	args: {
		value: "option-1",
		id: "selected-label",
		selectedLabel: "Option 1",
	},
};

export const Validation = {
	render: () => (
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
	),
	parameters: { docs: { description: { story: validation } } },
};

export default {
	title: "1) Elements/Autocomplete",
	component: Autocomplete,
	argTypes: {
		children: { control: "text" },
		labelSuffix: { control: "text" },
		value: { control: "text" },
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ WithLabel, Nullable, WithPlaceholder, WithSelectedLabel, Validation ] } />,
		},
	},
	decorators: [
		Story => (
			// Min height to make room for options dropdown.
			<div style={ { minHeight: 200 } }>
				<Story />
			</div>
		),
	],
};
