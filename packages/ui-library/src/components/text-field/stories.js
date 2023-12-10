// eslint-disable react/display-name
import { map, noop } from "lodash";
import React, { useCallback, useState } from "react";
import { StoryComponent } from ".";
import { VALIDATION_VARIANTS } from "../../constants";

export default {
	title: "2) Components/Text field",
	component: StoryComponent,
	argTypes: {
		description: { control: "text" },
		labelSuffix: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple input field component.",
			},
		},
	},
	args: {
		id: "input-field",
		onChange: noop,
		label: "A text field",
	},
};

export const Factory = {
	component: args => {
		const [ value, setValue ] = useState( args.value || "" );
		const handleChange = useCallback( setValue, [ setValue ] );

		return (
			<StoryComponent { ...args } value={ value } onChange={ handleChange } />
		);
	},
	parameters: {
		controls: { disable: false },
	},
};

export const WithLabelAndDescription = {
	storyName: "With label and description",
	component: Factory.component.bind( {} ),
	args: {
		id: "input-field-1",
		label: "Input field with a label",
		description: "Input field with a description.",
	},
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<StoryComponent
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
