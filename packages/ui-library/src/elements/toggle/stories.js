import { useArgs } from "@storybook/preview-api";
import { noop } from "lodash";
import React, { useCallback } from "react";
import Toggle from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";

const Template = ( args ) => {
	const [ { checked }, updateArgs ] = useArgs();
	const handleChange = useCallback( newChecked => updateArgs( { checked: newChecked } ), [ updateArgs ] );

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
	parameters: {
		docs: {
			description: { component },
			page: InteractiveDocsPage,
		},
	},
};
