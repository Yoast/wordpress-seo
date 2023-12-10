import { map } from "lodash";
import React from "react";
import TextareaField from ".";
import { VALIDATION_VARIANTS } from "../../constants";

export default {
	title: "2) Components/Textarea field",
	component: TextareaField,
	argTypes: {
		description: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple textarea field component.",
			},
		},
	},
	args: {
		id: "textarea-field",
		label: "A textarea field",
	},
};

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
		id: "textarea-field-1",
		label: "Textarea field with a label",
		description: "Textarea field with a description.",
	},
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<TextareaField
				key={ variant }
				id={ `validation-${ variant }` }
				label={ `With validation of variant ${ variant }` }
				defaultValue="The quick brown fox jumps over the lazy dog"
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
Validation.parameters = {
	// Since upgrade to Storybook 7 this story renders empty. Disabling it for now.
	storyshots: { disable: true },
};
