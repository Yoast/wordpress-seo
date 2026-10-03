import React from "react";
import Title from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { as, component, sizes } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Title factory",
	},
};

export const As = {
	render: ( args ) => (
		<div className="yst-flex yst-flex-col yst-gap-2">
			<Title as="h1">As h1</Title>
			<Title as="h2">As h2</Title>
			<Title as="h3">As h3</Title>
			<Title as="h4">As h4</Title>
			<Title as="span" size="2">As span with size 2</Title>
		</div>
	),
	parameters: {
		docs: { description: { story: as } },
	},
};

export const Sizes = {
	render: ( args ) => (
		<div className="yst-flex yst-flex-col yst-gap-2">
			<Title size="1">Size 1</Title>
			<Title size="2">Size 2</Title>
			<Title size="3">Size 3</Title>
			<Title size="4">Size 4</Title>
		</div>
	),
	parameters: {
		docs: { description: { story: sizes } },
	},
};

export default {
	title: "1) Elements/Title",
	component: Title,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "h1", "h2", "h3", "h4", "h5", "h6", "span" ] },
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ As, Sizes ] } />,
		},
	},
};
