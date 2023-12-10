import { keys } from "lodash";
import React from "react";
import Spinner, { classNameMap } from ".";
import { component, sizes, variants } from "./docs";

const WithBlackBackground = ( { withBlackBackground = true, children } ) => (
	<div className="yst-relative yst-w-fit">
		{ withBlackBackground && <div className="yst-absolute yst-inset-0 yst--m-2 yst-bg-black" /> }
		{ children }
	</div>
);

export default {
	title: "1) Elements/Spinner",
	component: Spinner,
	argTypes: {
		className: { control: "text" },
		variant: {
			control: "select",
			options: keys( classNameMap.variant ),
			table: {
				type: { summary: keys( classNameMap.variant ).join( "|" ) },
			},
		},
		size: {
			control: "select",
			options: keys( classNameMap.size ),
			table: { type: { summary: keys( classNameMap.size ).join( "|" ) } },
		},
	},
	args: {
		className: "",
	},
	parameters: {
		docs: {
			description: {
				component,
			},
		},
	},
	decorators: [
		( Story, context ) => (
			<WithBlackBackground withBlackBackground={ context.args.variant === "white" }>
				<Story />
			</WithBlackBackground>
		),
	],
};

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-gap-5">
		<Spinner variant="default" />
		<Spinner variant="primary" />
		<WithBlackBackground>
			<Spinner variant="white" />
		</WithBlackBackground>
	</div>
);
Variants.parameters = {
	docs: { description: { story: variants } },
};

export const Sizes = ( args ) => (
	<div className="yst-flex yst-gap-5">
		<Spinner size="3" />
		<Spinner size="4" />
		<Spinner size="8" />
	</div>
);
Sizes.parameters = {
	docs: { description: { story: sizes } },
};
