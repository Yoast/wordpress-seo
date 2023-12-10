import React from "react";
import FeatureUpsell from ".";
import { card, component } from "./docs";

export default {
	title: "2) Components/Feature upsell",
	component: FeatureUpsell,
	parameters: {
		docs: {
			description: {
				component,
			},
		},
	},
	argTypes: {
		children: { control: "text" },
	},
	args: {
		children: <p className="yst-p-2 yst-bg-blue-700 yst-text-white">Content that will be grayscale.</p>,
	},
};

const Template = args => <FeatureUpsell { ...args } />;

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};

export const Card = Template.bind( {} );
Card.args = {
	variant: "card",
	cardLink: "#",
	cardText: "Upgrade",
};
Card.parameters = { docs: { description: { story: card } } };
