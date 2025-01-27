import React from "react";
import FeatureUpsell from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { card, component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
};

export const Card = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: card } },
	},
	args: {
		variant: "card",
		cardLink: "#",
		cardText: "Upgrade",
	},
};

export default {
	title: "2) Components/Feature upsell",
	component: FeatureUpsell,
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Card ] } />,
		},
	},
	argTypes: {
		children: { control: "text" },
	},
	args: {
		variant: "default",
		children: (
			<p className="yst-p-2 yst-bg-blue-700 yst-text-white">
				This is the content that is locked behind the Feature Upsell.
				All the content in here will be grayscale when its enabled.
				For demo purposes, this paragraph is colored to highlight the grayscale functionality.

			</p>
		),
	},
};
