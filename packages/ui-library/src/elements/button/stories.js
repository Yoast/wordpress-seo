import React from "react";
import Button, { classNameMap } from ".";
import { component, sizes, states, variants } from "./docs";

export default {
	title: "1) Elements/Button",
	component: Button,
	argTypes: {
		children: { control: "text" },
		as: {
			options: [ "button", "div", "span", "a" ],
			table: { type: { summary: [ "button", "div", "span", "a" ].join( "|" ) } },
		},
		variant: {
			options: Object.keys( classNameMap.variant ),
			control: "select",
			table: { type: { summary: Object.keys( classNameMap.variant ).join( "|" ) } },
		},
		size: {
			options: Object.keys( classNameMap.size ),
			control: "select",
			table: { type: { summary: Object.keys( classNameMap.size ).join( "|" ) } },
		},
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( { children, ...args } ) => {
	if ( args.as === "a" ) {
		// Add the href attribute, so focus styles can be tested too.
		args.href = "#!";
	}
	return (
		<Button { ...args }>{ children }</Button>
	);
};
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Button factory",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button variant="primary">Primary (default)</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="tertiary">Tertiary</Button>
		<Button variant="error">Error</Button>
		<Button variant="upsell">Upsell</Button>
	</div>
);
Variants.parameters = { docs: { description: { story: variants } } };

export const Sizes = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button size="extra-large">Extra large</Button>
		<Button size="large">Large</Button>
		<Button size="default">Default</Button>
		<Button size="small">Small</Button>
	</div>
);
Sizes.parameters = {
	controls: { disable: true },
	actions: { disable: true },
	docs: { description: { story: "There are three available sizes, please refrain from using custom sizes." } },
};
Sizes.parameters = { docs: { description: { story: sizes } } };

export const States = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button isLoading={ true }>Loading</Button>
		<Button disabled={ true }>Disabled</Button>
		<Button disabled={ true } className="yst-pointer-events-none">Disabled & without pointer-events</Button>
	</div>
);
States.parameters = {
	controls: { disable: true },
	actions: { disable: true },
	docs: { description: { story: states } },
};
