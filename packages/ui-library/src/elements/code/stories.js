import React from "react";
import { StoryComponent } from ".";
import { component, variants } from "./docs";

export default {
	title: "1) Elements/Code",
	component: StoryComponent,
	argTypes: {
		children: { control: "text" },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = {
	component: ( args ) => <StoryComponent { ...args } />,
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Code factory",
		variant: "default",
	},
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<StoryComponent>https://example.com/ (default)</StoryComponent>
		<StoryComponent className="yst-w-fit">https://example.com/ (default with class `yst-w-fit`)</StoryComponent>
		<StoryComponent variant="block">
			{ /* eslint-disable-next-line max-len */ }
			https://example.com/that_is_really_long/so_you_see_that_it_will_start_scrolling?oh_my_this_is_not_enough_text=lets_add_some_parameters&more_parameters=yes_please&one_more=for_good_measure
			(block)
		</StoryComponent>
	</div>
);
Variants.parameters = {
	docs: {
		description: {
			story: variants,
		},
	},
};
