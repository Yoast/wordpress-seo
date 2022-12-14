import Spinner, { classNameMap, StoryComponent } from ".";
import { keys } from "lodash";

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
				component: "A simple spinner component.",
			},
		},
	},
};

export const Factory = ( args ) => (
	<div className={ args.variant ? "white" && "yst-bg-black yst-w-14 yst-p-2" : "" }>
		<Spinner { ...args } />
	</div>
);

export const Variants = ( args ) => (
	<div className="yst-flex yst-gap-5">
		<Spinner variant="default" />
		<Spinner variant="primary" />
		<div className="yst-bg-black yst-p-2">
			<Spinner variant="white" />
		</div>
	</div>
);

export const Sizes = ( args ) => (
	<div className="yst-flex yst-gap-5">
		<Spinner size="3" />
		<Spinner size="4" />
		<Spinner size="8" />
	</div>
);
