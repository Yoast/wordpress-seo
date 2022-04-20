import { useState, useCallback } from "@wordpress/element";

import Select from ".";

export default {
	title: "1. Elements/Select",
	component: Select,
	parameters: {
		docs: {
			description: {
				component: "A simple select component.",
			},
		},
	},
};

const Template = ( args ) => {
	const [ value, setValue ] = useState( args.value || "" );
	const handleChange = useCallback( setValue, [ setValue ] );

	return (
		// Min height to make room for options dropdown.
		<div style={ { minHeight: 200 } }>
			<Select { ...args } value={ value } onChange={ handleChange } />
		</div>
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
	actions: { disable: false },
};
Factory.args = {
	id: "select",
	value: "1",
	options: [
		{ value: "1", label: "Option 1" },
		{ value: "2", label: "Option 2" },
		{ value: "3", label: "Option 3" },
		{ value: "4", label: "Option 4" },
	],
};

export const States = Template.bind( {} );
States.args = {
	id: "select",
	value: "1",
	isError: true,
	options: [
		{ value: "1", label: "With error" },
	],
};
