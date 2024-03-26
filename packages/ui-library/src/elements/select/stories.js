import { useArgs } from "@storybook/preview-api";
import { find, map, noop } from "lodash";
import React, { useCallback, useMemo } from "react";
import Select from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { VALIDATION_VARIANTS } from "../validation/constants";
import { childrenProp, component, optionsProp, validation } from "./docs";

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
		<Select
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
		id: "select",
		value: "1",
		options: [
			{ value: "1", label: "Option 1" },
			{ value: "2", label: "Option 2" },
			{ value: "3", label: "Option 3" },
			{ value: "4", label: "Option 4" },
		],
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
		value: "3",
		label: "Select field with a options as array",
		options: Factory.args.options,
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
		value: "3",
		label: "Select field with options as exposed React components",
		selectedLabel: Factory.args.options[ 2 ].label,
		children: Factory.args.options.map( option => <Select.Option key={ option.value } { ...option } /> ),
	},
};

export const Validation = {
	render: () => (
		<div className="yst-space-y-8">
			{ map( VALIDATION_VARIANTS, variant => (
				<Select
					key={ variant }
					id={ `validation-${ variant }` }
					label={ `With validation of variant ${ variant }` }
					options={ Factory.args.options }
					value={ Factory.args.options[ 0 ].value }
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
	),
	parameters: { docs: { description: { story: validation } } },
};

export default {
	title: "1) Elements/Select",
	component: Select,
	argTypes: {
		children: { control: "text" },
		labelSuffix: { control: "text" },
		value: { control: "text" },
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ OptionsProp, ChildrenProp, Validation ] } />,
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
