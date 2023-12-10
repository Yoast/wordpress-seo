import React from "react";
import Alert, { classNameMap, roleMap } from ".";
import { component, variants } from "./docs";

export default {
	title: "1) Elements/Alert",
	component: Alert,
	argTypes: {
		children: { control: "text" },
		as: {
			control: { type: "select" },
			options: [ "span", "div" ],
			table: { type: { summary: "span | div" }, defaultValue: { summary: "span" } },
		},
		variant: {
			options: Object.keys( classNameMap.variant ),
			control: { type: "select" },
			table: { type: { summary: Object.keys( classNameMap.variant ).join( "|" ) }, defaultValue: { summary: "info" } },
		},
		role: {
			options: Object.keys( roleMap ),
			control: { type: "select" },
			table: { type: { summary: Object.keys( roleMap ).join( "|" ) }, defaultValue: { summary: "status" } },
		},
	},
	parameters: {
		docs: {
			description: {
				component,
			},
		},
	},
};

export const Factory = ( { children, ...args } ) => (
	<Alert { ...args }>{ children }</Alert>
);
Factory.parameters = {
	jest: "snapshot",
	controls: { disable: false },
};
Factory.args = {
	children: "Alert factory",
};

export const Variants = ( args ) => {
	const Link = <a href="https://yoast.com">with a link</a>;
	return (
		<div className="yst-flex yst-flex-col yst-gap-2">
			<Alert variant="info">This is an information alert { Link }. (default)</Alert>
			<Alert variant="warning">This is a warning alert { Link }.</Alert>
			<Alert variant="success" role="alert">This is a success alert { Link }.</Alert>
			<Alert variant="error" role="alert">This is an error alert { Link }.</Alert>
		</div>
	);
};
Variants.parameters = { docs: { description: { story: variants } } };
