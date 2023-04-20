import { useCallback, useState } from "@wordpress/element";
import { noop } from "lodash";
import { StoryComponent } from ".";
import { component } from "./docs";

export default {
	title: "1) Elements/Toggle",
	component: StoryComponent,
	argTypes: {
		as: { options: [ "button", "div", "span" ] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( args ) => {
	const [ checked, setChecked ] = useState( args.checked || false );
	const handleChange = useCallback( setChecked, [ setChecked ] );

	return (
		<StoryComponent { ...args } checked={ checked } onChange={ handleChange } />
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
