import { classNameMap, StoryComponent } from ".";
import { component, sizes, states, variants } from "./docs";

export default {
	title: "1) Elements/Button",
	component: StoryComponent,
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

export const Factory = ( { children, ...args } ) => (
	<StoryComponent { ...args }>{ children }</StoryComponent>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Button factory",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<StoryComponent variant="primary">Primary (default)</StoryComponent>
		<StoryComponent variant="secondary">Secondary</StoryComponent>
		<StoryComponent variant="tertiary">Tertiary</StoryComponent>
		<StoryComponent variant="error">Error</StoryComponent>
		<StoryComponent variant="upsell">Upsell</StoryComponent>
	</div>
);
Variants.parameters = { docs: { description: { story: variants } } };

export const Sizes = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<StoryComponent size="extra-large">Extra large</StoryComponent>
		<StoryComponent size="large">Large</StoryComponent>
		<StoryComponent size="default">Default</StoryComponent>
		<StoryComponent size="small">Small</StoryComponent>
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
		<StoryComponent isLoading={ true }>Loading</StoryComponent>
		<StoryComponent disabled={ true }>Disabled</StoryComponent>
		<StoryComponent disabled={ true } className="yst-pointer-events-none">Disabled & without pointer-events</StoryComponent>
	</div>
);
States.parameters = {
	controls: { disable: true },
	actions: { disable: true },
	docs: { description: { story: states } },
};
