import React from "react";
import ChildrenLimiter from ".";
import { Button } from "../../";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";

const renderButton = ( { show, toggle, ariaProps } ) => (
	<Button className="yst-my-1.5" onClick={ toggle } { ...ariaProps }>
		{ show ? "Less" : "More" }
	</Button>
);

const Template = args => (
	<ChildrenLimiter { ...args }>
		{ [ ...Array( 10 ).keys() ].map( n => <p key={ n }>{ n }</p> ) }
	</ChildrenLimiter>
);

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
};

export default {
	title: "2) Components/Children limiter",
	component: ChildrenLimiter,
	parameters: {
		docs: {
			description: {
				component: "A simple component to limit the amount of children rendered. Handy within menus.",
			},
			page: InteractiveDocsPage,
		},
	},
	argTypes: {
		children: { control: { disable: true } },
		renderButton: { control: { disable: true } },
	},
	args: {
		limit: 5,
		renderButton,
	},
};
