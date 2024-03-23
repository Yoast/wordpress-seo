import React from "react";
import Button, { classNameMap } from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, sizes, states, variants } from "./docs";

export const Factory = {
	render: ( { children, ...args } ) => {
		if ( args.as === "a" ) {
			// Add the href attribute, so focus styles can be tested too.
			args.href = "#!";
		}
		return (
			<Button { ...args }>{ children }</Button>
		);
	},
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Button factory",
	},
};

export const Variants = {
	render: ( args ) => (
		<div className="yst-flex yst-items-end yst-gap-2">
			<Button variant="primary">Primary (default)</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="tertiary">Tertiary</Button>
			<Button variant="error">Error</Button>
			<Button variant="upsell">Upsell</Button>
		</div>
	),
	parameters: { docs: { description: { story: variants } } },
};

export const Sizes = {
	render: ( args ) => (
		<div className="yst-flex yst-items-end yst-gap-2">
			<Button size="extra-large">Extra large</Button>
			<Button size="large">Large</Button>
			<Button size="default">Default</Button>
			<Button size="small">Small</Button>
		</div>
	),
	parameters: {
		controls: { disable: true },
		actions: { disable: true },
		docs: { description: { story: sizes } },
	},
};

export const States = {
	render: ( args ) => (
		<div className="yst-flex yst-items-end yst-gap-2">
			<Button isLoading={ true }>Loading</Button>
			<Button disabled={ true }>Disabled</Button>
			<Button disabled={ true } className="yst-pointer-events-none">Disabled & without pointer-events</Button>
		</div>
	),
	parameters: {
		controls: { disable: true },
		actions: { disable: true },
		docs: { description: { story: states } },
	},
};

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
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Variants, Sizes, States ] } />,
		},
	},
};
