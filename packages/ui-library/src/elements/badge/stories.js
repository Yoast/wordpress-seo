import React from "react";
import Badge from ".";
import { component, sizes, variants } from "./docs";

export default {
	title: "1) Elements/Badge",
	component: Badge,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "span", "div" ] },
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
	<Badge { ...args }>{ children }</Badge>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Badge factory",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Badge variant="info">Info (default)</Badge>
		<Badge variant="upsell">Upsell</Badge>
		<Badge variant="plain">Plain</Badge>
	</div>
);
Variants.parameters = { docs: { description: { story: variants } } };

export const Sizes = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Badge size="large">Large</Badge>
		<Badge>Default</Badge>
		<Badge size="small">Small</Badge>
	</div>
);
Sizes.parameters = { docs: { description: { story: sizes } } };
