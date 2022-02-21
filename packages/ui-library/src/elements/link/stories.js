import React from "react";
import Link from ".";

export default {
	title: "1. Elements/Link",
	component: Link,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "a", "button" ] },
		className: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "Create a link. However, it is up to you to implement the needed properties. I.e. an anchor tag needs `href`, but a button needs an `onClick`. This component does not know about either one.",
			},
		},
	},
};

export const Factory = ( { children, ...args } ) => (
	<Link { ...args }>{ children }</Link>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Link factory",
};

export const Anchor = {
	component: Factory.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: "Pass the `href`, `target` and `rel` props to get the attributes.",
			},
		},
	},
	args: {
		children: "yoast.com",
		href: "https://yoast.com",
		target: "_blank",
		rel: "noopener noreferrer",
	},
};

export const Button = {
	component: Factory.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: "When specifying `button`, pass the `onClick` prop to have a functional button.",
			},
			transformSource: () => (
				"const handleClick = () => alert( \"You clicked the button!\" )" +
				"\n\n" +
				"<Link\n" +
				"  as=\"button\"\n" +
				"  onClick={ handleClick }\n" +
				">\n" +
				"  Button\n" +
				"</Link>"
			),
		},
	},
	args: {
		as: "button",
		children: "Button",
		onClick: () => alert( "You clicked the button!" ),
	},
};

export const CustomComponent = {
	component: Factory.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: "When using a custom component, that component will only look like a link by default. Please make sure the component behaves like a link.",
			},
			transformSource: () => (
				"const Component = ( { className, children } ) => <span className={ className }>Custom { children }</span>" +
				"\n\n" +
				"<Link as={ Component }>\n" +
				"  component\n" +
				"</Link>"
			),
		},
	},
	args: {
		as: ( { className, children } ) => <span className={ className }>Custom { children }</span>,
		children: "component",
	},
};
