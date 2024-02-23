// eslint-disable react/display-name
import { StoryComponent } from ".";
import { component, anchor, button, customComponent } from "./docs";

export default {
	title: "1) Elements/Link",
	component: StoryComponent,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "a", "button" ] },
		className: { control: "text" },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( { children, ...args } ) => {
	if ( args.as === "a" || typeof args.as === "undefined" ) {
		args.href = "#!";
	}

	return (
		<StoryComponent { ...args }>{ children }</StoryComponent>
	);
};
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
				story: anchor,
			},
		},
	},
	args: {
		children: <><span className="yst-sr-only">(Opens in a new browser tab)</span>yoast.com</>,
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
				story: button,
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
		// eslint-disable-next-line no-alert
		onClick: () => alert( "You clicked the button!" ),
	},
};

export const CustomComponent = {
	component: Factory.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: customComponent,
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

CustomComponent.storyName = "Custom component";
