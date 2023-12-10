import { keys } from "lodash";
import React from "react";
import { classNameMap, StoryComponent } from ".";
import { component, sizes, variants } from "./docs";

export default {
	title: "1) Elements/Spinner",
	component: StoryComponent,
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
};

export const Factory = ( args ) => (
	<div className={ args.variant ? "white" && "yst-bg-black yst-w-14 yst-p-2" : "" }>
		<StoryComponent { ...args } />
	</div>
);

export const Variants = ( args ) => (
	<div className="yst-flex yst-gap-5">
		<StoryComponent variant="default" />
		<StoryComponent variant="primary" />
		<div className="yst-bg-black yst-p-2">
			<StoryComponent variant="white" />
		</div>
	</div>
);

Variants.parameters = {
	docs: { description: { story: variants } },
};

export const Sizes = ( args ) => (
	<div className="yst-flex yst-gap-5">
		<StoryComponent size="3" />
		<StoryComponent size="4" />
		<StoryComponent size="8" />
	</div>
);

Sizes.parameters = {
	docs: { description: { story: sizes } },
};
