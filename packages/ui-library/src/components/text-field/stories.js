import { map, noop } from "lodash";
import React from "react";
import TextField from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { VALIDATION_VARIANTS } from "../../constants";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
};

export const WithLabelAndDescription = {
	name: "With label and description",
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "input-field-1",
		label: "Input field with a label",
		description: "Input field with a description.",
	},
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<TextField
				key={ variant }
				id={ `validation-${ variant }` }
				name={ `validation-${ variant }` }
				label={ `With validation of variant ${ variant }` }
				value="The quick brown fox jumps over the lazy dog"
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
	title: "2) Components/Text field",
	component: TextField,
	argTypes: {
		description: { control: "text" },
		labelSuffix: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple input field component.",
			},
			page: () => <InteractiveDocsPage stories={ [ WithLabelAndDescription, Validation ] } />,
		},
	},
	args: {
		id: "input-field",
		onChange: noop,
		label: "A text field",
	},
};
