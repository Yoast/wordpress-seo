import React from "react";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, withFlex } from "./docs";
import { TooltipContainer, TooltipTrigger, TooltipWithContext } from "./index";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: <>
			<TooltipTrigger ariaDescribedby="tooltip-factory">Element containing a tooltip.</TooltipTrigger>
			<TooltipWithContext id="tooltip-factory">I&apos;m a tooltip</TooltipWithContext>
		</>,
	},
};

export const Trigger = {
	name: "TooltipTrigger",
	render: ( args ) => <TooltipTrigger { ...args } />,
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Element containing a tooltip.",
		ariaDescribedby: "tooltip-trigger",
	},
	decorators: [
		( Story, args ) => (
			<TooltipContainer>
				<Story />
				<TooltipWithContext id={ args.ariaDescribedby }>I&apos;m a tooltip</TooltipWithContext>
			</TooltipContainer>
		),
	],
};

export const WithContext = {
	name: "TooltipWithContext",
	render: ( args ) => <TooltipWithContext { ...args } />,
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "tooltip",
		children: "I'm a tooltip",
	},
	decorators: [
		( Story, args ) => (
			<TooltipContainer>
				<TooltipTrigger ariaDescribedby={ args.id }>Element containing a tooltip.</TooltipTrigger>
				<Story />
			</TooltipContainer>
		),
	],
};

export const WithFlex = {
	name: "With display flex",
	render: ( args ) => <TooltipWithContext { ...args } />,
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: withFlex,
			},
		},
	},
	args: {
		id: "tooltip",
		children: <div className="yst-flex yst-flex-col">
			<span>Row one</span>
			<span>Row two</span>
		</div>,
	},
	decorators: [
		( Story, args ) => (
			<TooltipContainer>
				<TooltipTrigger ariaDescribedby={ args.id }>Element containing a tooltip.</TooltipTrigger>
				<Story />
			</TooltipContainer>
		),
	],
};


export default {
	title: "2) Components/Tooltip Container",
	component: TooltipContainer,
	argTypes: {
		as: {
			control: { type: "select" },
			options: [ "span", "div" ],
			table: { type: { summary: "span | div" }, defaultValue: { summary: "span" } },
		},
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => <InteractiveDocsPage stories={ [ Trigger, WithContext, WithFlex ] } />,
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-m-20">
				<Story />
			</div>
		),
	],
};
