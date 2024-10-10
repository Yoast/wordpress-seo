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
	},
	argTypes: {
		type: {
			description: "The keyphrase table button type.",
			control: {
				type: "text",
			},
		},
	},
	render: () => {
		return <div className="yst-flex yst-gap-2">
			<TableButton type="add" add={ noop } remove={ noop } />
			<TableButton type="remove" add={ noop } remove={ noop } />
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
