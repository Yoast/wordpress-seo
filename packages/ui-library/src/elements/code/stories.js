import Code from ".";

export default {
	title: "1. Elements/Code",
	component: Code,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple code component.",
			},
		},
	},
};

export const Factory = {
	component: ( args ) => <Code { ...args } />,
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Code Factory",
		variant: "default",
	},
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<Code>https://example.com/ (default)</Code>
		<Code className="yst-w-fit">https://example.com/ (default with class `yst-w-fit`)</Code>
		<Code variant="block">
			{ /* eslint-disable-next-line max-len */ }
			https://example.com/that_is_really_long/so_you_see_that_it_will_start_scrolling?oh_my_this_is_not_enough_text=lets_add_some_parameters&more_parameters=yes_please&one_more=for_good_measure
			(block)
		</Code>
	</div>
);
Variants.parameters = {
	docs: {
		description: {
			story: "Notice the default also expanding like a block due to the flex of the parent.",
		},
	},
};
