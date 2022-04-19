import Badge from ".";

export default {
	title: "1. Elements/Badge",
	component: Badge,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "span", "div" ] },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple badge component.",
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
	children: "Badge Factory",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Badge variant="info">Info (default)</Badge>
		<Badge variant="upsell">Upsell</Badge>
		<Badge variant="plain">Plain</Badge>
	</div>
);
