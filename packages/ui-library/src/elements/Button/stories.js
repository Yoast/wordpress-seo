import Button from ".";

export default {
	title: "1. Elements/Button",
	component: Button,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "button", "div", "span" ] },
	},
	parameters: {
		docs: {
			description: {
				component: "The button component is used for actions.",
			},
		},
	},
};

export const Factory = ( { children, ...args } ) => (
	<Button { ...args }>{ children }</Button>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Button Factory",
};

export const Variants = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button variant="primary">Primary (default)</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="error">Error</Button>
		<Button variant="upsell">Upsell</Button>
	</div>
);

export const Sizes = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button size="large">Large</Button>
		<Button size="default">Default</Button>
		<Button size="small">Small</Button>
	</div>
);
Sizes.parameters = {
	controls: { disable: true },
	actions: { disable: true },
	docs: { description: { story: "There are three available sizes, please refrain from using custom sizes." } },
};

export const States = ( args ) => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button isLoading={ true }>Loading</Button>
		<Button isDisabled={ true }>Disabled</Button>
	</div>
);
