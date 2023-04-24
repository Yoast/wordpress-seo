import { StoryComponent } from ".";

export default {
	title: "1) Elements/Title",
	component: StoryComponent,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "h1", "h2", "h3", "h4", "h5", "h6", "span" ] },
	},
	parameters: {
		docs: {
			description: {
				component: "The title component is used for displaying headings.",
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
	children: "Title factory",
};

export const As = args => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<StoryComponent as="h1">As h1</StoryComponent>
		<StoryComponent as="h2">As h2</StoryComponent>
		<StoryComponent as="h3">As h3</StoryComponent>
		<StoryComponent as="h4">As h4</StoryComponent>
		<StoryComponent as="span" size="2">As span with size 2</StoryComponent>
	</div>
);
As.parameters = {
	docs: { description: { story: "Control the Title component using the `as` prop. Using a heading component without the `size` prop will infer the size from the heading component, ie. `as=\"h1\"` will automagically add size 1." } },
};

export const Sizes = args => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<StoryComponent size="1">Size 1</StoryComponent>
		<StoryComponent size="2">Size 2</StoryComponent>
		<StoryComponent size="3">Size 3</StoryComponent>
		<StoryComponent size="4">Size 4</StoryComponent>
	</div>
);
Sizes.parameters = {
	docs: { description: { story: "Control the Title size using the `size` prop. There are four available sizes, please refrain from using custom sizes" } },
};
