import React from "react";
import { noop } from "lodash";
import TableButton from ".";
import { component } from "./docs";


export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		type: "add",
		onAdd: noop,
		onRemove: noop,
	},
	argTypes: {
		type: {
			description: "The keyphrase table button type.",
			control: {
				type: "text",
			},
		},
	},
	render: ( { disabled } ) => {
		return <div className="yst-flex yst-gap-2">
			<TableButton type="add" onAdd={ noop } onRemove={ noop } disabled={ disabled } />
			<TableButton type="remove" onAdd={ noop } onRemove={ noop } disabled={ disabled } />
		</div>;
	},
};

export default {
	title: "2) Elements/TableButton",
	component: TableButton,
	parameters: {
		docs: {
			description: { component },
		},
	},
};
