// eslint-disable react/display-name
import { noop, map } from "lodash";
import { VALIDATION_VARIANTS } from "../../constants";
import { StoryComponent } from ".";

export default {
	title: "2) Components/Textarea Field",
	component: StoryComponent,
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
		label: "A Textarea Field",
	},
};

export const Factory = {
	component: args => <StoryComponent { ...args } />,
	parameters: {
		controls: { disable: false },
	},
};

export const WithLabelAndDescription = {
	component: Factory.component.bind( {} ),
	args: {
		id: "textarea-field-1",
		label: "Textarea field with a label",
		description: "Textarea field with a description.",
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
