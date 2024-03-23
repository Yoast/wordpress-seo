import React from "react";
import Badge from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, sizes, variants } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Badge factory",
	},
};

export const Variants = {
	render: ( args ) => (
		<div className="yst-flex yst-items-end yst-gap-2">
			<Badge variant="info">Info (default)</Badge>
			<Badge variant="upsell">Upsell</Badge>
			<Badge variant="plain">Plain</Badge>
		</div>
	),
	parameters: { docs: { description: { story: variants } } },
};

export const Sizes = {
	render: ( args ) => (
		<div className="yst-flex yst-items-end yst-gap-2">
			<Badge size="large">Large</Badge>
			<Badge>Default</Badge>
			<Badge size="small">Small</Badge>
		</div>
	),
	parameters: { docs: { description: { story: sizes } } },
};

export default {
	title: "1) Elements/Badge",
	component: Badge,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "span", "div" ] },
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Variants, Sizes ] } />,
		},
	},
};
