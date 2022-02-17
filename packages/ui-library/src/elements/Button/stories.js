import Button from ".";

export default {
	title: "Elements/Button",
	component: Button,
	argTypes: {
		children: { control: "text" },
		as: { control: { disable: true } },
	},
	parameters: {
		docs: {
			description: {
				component: "The button component is used for bladibladibla",
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

export const Variants = () => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="error">Error</Button>
	</div>
);

export const Sizes = () => (
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

export const States = () => (
	<div className="yst-flex yst-items-end yst-gap-2">
		<Button size="large">Loading</Button>
		<Button size="default">Default</Button>
		<Button size="small">Small</Button>
	</div>
);


