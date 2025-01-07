import { useArgs } from "@storybook/preview-api";
import { find, map, noop } from "lodash";
import React, { useCallback } from "react";
import SelectField from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { VALIDATION_VARIANTS } from "../../constants";
import { Badge } from "../../index";

const Template = ( args ) => {
	const [ , updateArgs ] = useArgs();
	const handleChange = useCallback( value => {
		const newArgs = { value };
		if ( args.children ) {
			// If children are used, update the selected label.
			newArgs.selectedLabel = find( args.children, [ "props.value", value ] )?.props?.label || "";
		}
		updateArgs( newArgs );
	}, [ updateArgs, args.options, args.children ] );

	return (
		<SelectField
			{ ...args }
			onChange={ handleChange }
		/>
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "select-field-0",
		name: "name-0",
		options: [
			{ value: "1", label: "Option 1" },
			{ value: "2", label: "Option 2" },
			{ value: "3", label: "Option 3" },
			{ value: "4", label: "Option 4" },
		],
		value: "1",
		label: "A select field",
	},
};

export const WithLabelAndDescription = {
	render: Template.bind( {} ),
	name: "With label and description",
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "select-field-1",
		name: "name-1",
		options: Factory.args.options,
		value: Factory.args.options[ 2 ].value,
		label: "Select field with a label",
		description: "Select field with a description.",
	},
};

export const WithError = {
	render: Template.bind( {} ),
	name: "With error",
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "select-field-2",
		name: "name-2",
		options: Factory.args.options,
		value: Factory.args.options[ 1 ].value,
		label: "Select field with a label",
		validation: {
			variant: "error",
			message: "Select field with an error.",
		},
	},
};

export const WithLabelSuffix = {
	render: Template.bind( {} ),
	name: "With label suffix",
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "select-field-3",
		name: "name-3",
		options: Factory.args.options,
		value: Factory.args.options[ 2 ].value,
		label: "Select field with a label suffix",
		labelSuffix: <Badge className="yst-ms-1.5" size="small">Beta</Badge>,
	},
};

export const OptionsProp = {
	render: Template.bind( {} ),
	name: "Options prop",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: "Add options as an array of objects with `options` prop. Each object must contain `value` and `label` parameters. The displayed selected label will be updated automatically on change." } },
	},
	args: {
		id: "select-field-4",
		name: "name-4",
		options: Factory.args.options,
		value: Factory.args.options[ 2 ].value,
		label: "Select field with a options as array",
	},
};

export const ChildrenProp = {
	render: Template.bind( {} ),
	name: "Children prop",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "Add options as an array of React components with `children` prop, using the exposed option component `SelectField.Option`. In this case changing the `selectedLabel` should be updated in the handleChange function. See the value updating in the code.",
			},
		},
	},
	args: {
		id: "select-field-5",
		name: "name-5",
		children: Factory.args.options.map( option => <SelectField.Option key={ option.value } { ...option } /> ),
		value: Factory.args.options[ 2 ].value,
		selectedLabel: Factory.args.options[ 2 ].label,
		label: "Select field with options as exposed React components",
	},
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, ( variant ) => (
			<SelectField
				key={ variant }
				id={ `validation-${ variant }` }
				name={ `validation-${ variant }` }
				options={ Factory.args.options }
				value={ Factory.args.options[ 0 ].value }
				label={ `With validation of variant ${ variant }` }
				onChange={ noop }
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
	title: "2) Components/Select field",
	component: SelectField,
	argTypes: {
		description: { control: "text" },
		children: { description: "Alternative to options.", control: "text" },
		labelSuffix: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple select field component that extends select element.",
			},
			page: () => (
				<InteractiveDocsPage
					stories={ [ WithLabelAndDescription, WithError, WithLabelSuffix, OptionsProp, ChildrenProp, Validation ] }
				/>
			),
		},
	},
	decorators: [
		( Story ) => (
			// Make room for options dropdown, preventing the scrollbar.
			<div className="yst-pb-32">
				<Story />
			</div>
		),
	],
};
