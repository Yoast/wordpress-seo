import React from "react";
import Paper from ".";
import Title from "../title";
import { component, withHeaderAndContent } from "./docs";

export default {
	title: "1) Elements/Paper",
	component: Paper,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "div", "main", "section" ] },
	},
	parameters: {
		backgrounds: {
			"default": "medium",
		},
		docs: {
			description: { component },
		},
	},
};

export const Factory = ( args ) => <Paper { ...args } />;
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Paper factory",
	className: "yst-p-6",
};

export const WithHeaderAndContent = {
	component: Factory.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: withHeaderAndContent,
			},
		},
	},
	args: {
		children: (
			<>
				<Paper.Header>
					<Title>Title</Title>
					<span>Description</span>
				</Paper.Header>
				<Paper.Content>
					<span>Content</span>
				</Paper.Content>
			</>
		),
	},
};
