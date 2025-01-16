import React from "react";
import Code from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, variants } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Code factory",
		variant: "default",
	},
};

export const Variants = {
	render: ( args ) => (
		<div className="yst-flex yst-flex-col yst-gap-2">
			<Code>https://example.com/ (default)</Code>
			<Code className="yst-w-fit">https://example.com/ (default with class `yst-w-fit`)</Code>
			<Code variant="block">
				{ /* eslint-disable-next-line stylistic/max-len */ }
				https://example.com/that_is_really_long/so_you_see_that_it_will_start_scrolling?oh_my_this_is_not_enough_text=lets_add_some_parameters&more_parameters=yes_please&one_more=for_good_measure
				(block)
			</Code>
		</div>
	),
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: variants,
			},
		},
	},
};

export default {
	title: "1) Elements/Code",
	component: Code,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Variants ] } />,
		},
	},
};
