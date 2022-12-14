import { useCallback, useState } from "@wordpress/element";
import { noop, map } from "lodash";
import TextField from ".";
import { VALIDATION_VARIANTS } from "../../constants";

export default {
	title: "2) Components/Text Field",
	component: TextField,
	argTypes: {
		description: { control: "text" },
		error: { control: "text" },
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
		label: "A Text Field",
	},
};

export const Factory = {
	component: args => {
		const [ value, setValue ] = useState( args.value || "" );
		const handleChange = useCallback( setValue, [ setValue ] );

		return (
			<TextField { ...args } value={ value } onChange={ handleChange } />
		);
	},
	parameters: {
		controls: { disable: false },
	},
};

export const WithLabelAndDescription = {
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
