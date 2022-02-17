import React from "react";
import { keys } from "lodash";

import Title, { classNameMap } from ".";

export default {
	title: "Elements/Title",
	component: Title,
	argTypes: {
		children: { control: "text" },
		size: {
			control: "radio",
			options: keys( classNameMap.size ),
		},
		as: { control: false },
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
	<Title {...args}>{children}</Title>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Title Factory",
};

export const As = ( args ) => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<Title as="h1">As h1</Title>
		<Title as="h2">As h2</Title>
		<Title as="h3">As h3</Title>
		<Title as="h4">As h4</Title>
		<Title as="span" size="2">As span with size 1</Title>
	</div>
);
As.parameters = {
	docs: { description: { story: "Control the Title Component using the `as` prop. Using a heading component without the `size` prop will infer the size from the heading component, ie. `as=\"h1\"` will automagically add size 1." } },
};

/**
 * There are four available sizes.
 */
export const Sizes = () => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<Title size="1">Size 1</Title>
		<Title size="2">Size 2</Title>
		<Title size="3">Size 3</Title>
		<Title size="4">Size 4</Title>
	</div>
);
Sizes.parameters = {
	docs: { description: { story: "Control the Title size using the `size` prop. There are four available sizes, please refrain from using custom sizes" } },
};