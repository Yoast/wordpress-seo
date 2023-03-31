import { StoryComponent } from ".";

export default {
	title: "1) Elements/Badge",
	component: StoryComponent,
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
	<StoryComponent { ...args }>{ children }</StoryComponent>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Badge factory",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<StoryComponent variant="info">Info (default)</StoryComponent>
		<StoryComponent variant="upsell">Upsell</StoryComponent>
		<StoryComponent variant="plain">Plain</StoryComponent>
	</div>
);

export const Sizes = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<StoryComponent size="large">Large</StoryComponent>
		<StoryComponent>Default</StoryComponent>
		<StoryComponent size="small">Small</StoryComponent>
	</div>
);
