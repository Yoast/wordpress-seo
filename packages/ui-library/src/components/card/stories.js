import React from "react";
import Card from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { Button } from "../../index";

export const Factory = {
	args: {
		children: (
			<>
				<Card.Header>This is Card header!</Card.Header>
				<Card.Content>This is Card content!</Card.Content>
				<Card.Footer>This is Card footer!</Card.Footer>
			</>
		),
	},
};

export const WithoutHeader = {
	name: "Without header",
	args: {
		children: (
			<>
				<Card.Content className="yst-h-24">This is Card content with a fixed height.</Card.Content>
				<Card.Footer>
					<Button className="yst-w-full">
						Footer with full-width button
					</Button>
				</Card.Footer>
			</>
		),
	},
};

export default {
	title: "2) Components/Card",
	component: Card,
	parameters: {
		docs: {
			description: {
				component: "A simple card component. It has subcomponents for header, content and footer that has `as` and `className` props.",
			},
			page: () => <InteractiveDocsPage stories={ [ WithoutHeader ] } />,
		},
	},
	argTypes: {
		children: { control: "text" },
		as: {
			control: { type: "select" },
			options: [ "div", "main", "section" ],
			table: { type: { summary: "div | main | section" }, defaultValue: { summary: "div" } },
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-flex yst-gap-5 yst-justify-center">
				<div className="yst-w-1/3">
					<Story />
				</div>
			</div>
		),
	],
};
