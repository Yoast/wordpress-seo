import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Title, { propertyMap } from ".";

export default {
	title: "Elements/Title",
	component: Title,
	argTypes: {
		children: { control: "text" },
		size: {
			defaultValue: null,
			control: {
				type: 'radio',
				options: ['unset', ...Object.keys(propertyMap.size)]
			}
		},
		as: {
			control: {
				type: 'select',
			}
		}
	},
	parameters: {
		docs: {
			description: {
				component: "The title component is used for displaying headings.",
			},
		},
	},
} as ComponentMeta<typeof Title>;

export const Factory: ComponentStory<typeof Title> = ({ children, ...args }) => (
	<Title {...args}>{children}</Title>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Title Factory",
};

/**
 * There are four available sizes.
 */
export const Sizes: ComponentStory<typeof Title> = () => (
	<div>
		<Title size="1">Size 1</Title>
		<Title size="2">Size 2</Title>
		<Title size="3">Size 3</Title>
		<Title size="4">Size 4</Title>
	</div>
);
Sizes.parameters = {
	controls: { disable: true },
	actions: { disable: true },
	docs: { description: { story: "There are four available sizes, please refrain from using custom sizes." } },
};

export const As: ComponentStory<typeof Title> = () => (
	<div>
		<Title as="h1">As h1</Title>
		<Title as="h2">As h2</Title>
		<Title as="h3">As h3</Title>
		<Title as="h4">As h4</Title>
	</div>
);
As.parameters = {
	controls: { disable: true },
	actions: { disable: true },
	docs: { description: { story: "There are four available element types." } },
};
