import { useArgs } from "@storybook/preview-api";
import React, { useCallback } from "react";
import ToggleField from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Badge from "../../elements/badge";
import { checked, component, withLabelAndDescription, withLabelSuffix } from "./docs";

const Template = ( args ) => {
	const [ { checked: isChecked }, updateArgs ] = useArgs();
	const handleChange = useCallback( newChecked => updateArgs( { checked: newChecked } ), [ updateArgs ] );

	return (
		<ToggleField { ...args } checked={ isChecked || false } onChange={ handleChange } />
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "factory-id",
		label: "A toggle field",
	},
};

export const WithLabelAndDescription = {
	render: Template.bind( {} ),
	name: "With label and description",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withLabelAndDescription } },
	},
	args: {
		id: "id-1",
		name: "name-1",
		label: "Toggle field with a label that spans multiple lines is still centered nicely with the toggle",
		children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a nisi egestas, accumsan ante quis, accumsan nisi. Duis lacinia pharetra luctus. Aliquam nisi orci, mattis quis lacus tristique, tempus pulvinar lectus. Nam rutrum vitae arcu at ullamcorper. Sed in felis blandit, consectetur nulla eu, congue justo. Suspendisse a augue a arcu lacinia tristique. Integer finibus dui sit amet pulvinar placerat. Phasellus a erat nec odio aliquet maximus id viverra nunc. Aliquam finibus malesuada est id dapibus. Curabitur suscipit lorem vitae sodales malesuada.",
	},
};

export const Checked = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
		docs: { description: { story: checked } },
	},
	args: {
		id: "id-2",
		name: "name-2",
		checked: true,
		label: "Checked toggle field",
	},
};

export const WithLabelSuffix = {
	render: Template.bind( {} ),
	name: "With label suffix",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: withLabelSuffix } },
	},
	args: {
		id: "id-3",
		name: "name-3",
		checked: true,
		label: "Label suffix toggle field",
		labelSuffix: <Badge className="yst-ml-1.5" variant="upsell">Premium</Badge>,
	},
};

export default {
	title: "2) Components/Toggle field",
	component: ToggleField,
	argTypes: {
		children: { control: "text" },
		description: { control: "text" },
		labelSuffix: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => <InteractiveDocsPage stories={ [ WithLabelAndDescription, Checked, WithLabelSuffix ] } />,
		},
	},
};
