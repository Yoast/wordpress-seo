import React from "react";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";
import { TooltipComponent, TooltipContainer, TooltipTrigger } from "./index";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: <>
			<TooltipTrigger ariaDescribedby="tooltip-factory">Element containing a tooltip.</TooltipTrigger>
			<TooltipComponent id="tooltip-factory">I&apos;m a tooltip</TooltipComponent>
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
				<TooltipComponent id={ args.ariaDescribedby }>I&apos;m a tooltip</TooltipComponent>
			</TooltipContainer>
		),
	],
};

export const Tooltip = {
	name: "TooltipComponent",
	render: ( args ) => <TooltipComponent { ...args } />,
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
			page: () => <InteractiveDocsPage stories={ [ Trigger, Tooltip ] } />,
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
