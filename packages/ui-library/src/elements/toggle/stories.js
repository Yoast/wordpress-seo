import { noop } from "lodash";
import React, { useCallback, useState } from "react";
import Toggle from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Toggle",
	component: Toggle,
	argTypes: {
		as: { options: [ "button", "div", "span" ] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( args ) => {
	const [ checked, setChecked ] = useState( args.checked || false );
	const handleChange = useCallback( setChecked, [ setChecked ] );

	return (
		<Toggle { ...args } checked={ checked } onChange={ handleChange } />
	);
};

Factory.parameters = {
	controls: { disable: false },
};

Factory.args = {
	id: "id-1",
	screenReaderLabel: "Toggle",
	checked: false,
	onChange: noop,
};
