import { useArgs } from "@storybook/preview-api";
import { filter, find, includes, map, noop, toLower } from "lodash";
import React, { useCallback, useMemo } from "react";
import AutocompleteField from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { VALIDATION_VARIANTS } from "../../constants";

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
		<AutocompleteField
			{ ...args }
			selectedLabel={ args?.selectedLabel || selectedOption?.label || "" }
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
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "factory",
		name: "factory",
		label: "Autocomplete field label",
		description: "Autocomplete field description",
		placeholder: "Search an option...",
	},
};

export const WithDescription = {
	render: Template.bind( {} ),
	name: "With description",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: "An example with description message using `description`." } },
	},
	args: {
		id: "with-description",
		name: "with-description",
		label: "Example label",
		description: "This is a description message",
	},
};

export const WithSelectedLabel = {
	render: Template.bind( {} ),
	name: "With selected label",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "When using `children` prop, `selectedLabel` prop is used to set default/selected value.",
			},
		},
	},
	args: {
		id: "selected-label",
		name: "selected-label",
		label: "Example label",
		selectedLabel: "Option 1",
		children: <>
			<AutocompleteField.Option value="child 1" label="Option 1" id="option-1" name="option-1" />
			<AutocompleteField.Option value="child 2" label="Option 2" id="option-2" name="option-2" />
			<AutocompleteField.Option value="child 3" label="Option 3" id="option-3" name="option-3" />
		</>,
	},
};

export const WithPlaceholder = {
	render: Template.bind( {} ),
	name: "With placeholder",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: "An example with placeholder." } },
	},
	args: {
		id: "with-placeholder",
		name: "with-placeholder",
		label: "Example label",
		placeholder: "Search a value...",
	},
};

export const ChildrenProp = {
	render: Template.bind( {} ),
	name: "Children prop",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "The `children` prop can be used to render custom content. The options are rendered using the sub component `Option` (`AutocompleteField.Option` is equal to `Autocomplete` element). Default values should be set inside the child component and not the `selectedLabel` prop.",
			},
		},
	},
	args: {
		id: "with-children-prop",
		name: "with-children-prop",
		label: "Example label",
		children: <>
			<AutocompleteField.Option value="child 1" label="Option 1" id="option-1" name="option-1" />
			<AutocompleteField.Option value="child 2" label="Option 2" id="option-2" name="option-2" />
			<AutocompleteField.Option value="child 3" label="Option 3" id="option-3" name="option-3" />
		</>,
	},
};

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
			page: () => <InteractiveDocsPage stories={ [ WithDescription, WithSelectedLabel, WithPlaceholder, ChildrenProp, Validation ] } />,
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
