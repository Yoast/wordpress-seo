import { noop } from "lodash";
import React, { useCallback, useState } from "react";
import Toggle from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Toggle",
	component: Toggle,
	argTypes: {
		as: { options: [ "button", "div", "span" ] },
		type: {
			control: "string",
			description: "When `as` is `button`, the type is forced to `button` for proper behavior in HTML forms.",
		},
	},
	parameters: { docs: { description: { component } } },
};

const Template = ( args ) => {
	const [ checked, setChecked ] = useState( args.checked || false );
	const handleChange = useCallback( setChecked, [ setChecked ] );

	return (
		<Toggle { ...args } checked={ checked } onChange={ handleChange } />
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "id-1",
		screenReaderLabel: "Toggle",
		checked: false,
		onChange: noop,
	},
};
