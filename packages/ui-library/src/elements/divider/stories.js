import React from "react";
import Divider from ".";
import Button from "../button";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, withButton, withLabel } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	render: ( args ) => (
		<div className="yst-w-96">
			<Divider { ...args } />
		</div>
	),
};

export const WithLabel = {
	render: () => (
		<div className="yst-w-96">
			<Divider>
				<span className="yst-px-2 yst-text-slate-500 yst-text-sm">Or</span>
			</Divider>
		</div>
	),
	parameters: {
		docs: { description: { story: withLabel } },
	},
};

export const WithButton = {
	render: () => (
		<div className="yst-w-96">
			<Divider>
				<Button variant="secondary" size="small">Show more</Button>
			</Divider>
		</div>
	),
	parameters: {
		docs: { description: { story: withButton } },
	},
};

export default {
	title: "1) Elements/Divider",
	component: Divider,
	argTypes: {
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		children: "",
		className: "",
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ WithLabel, WithButton ] } />,
		},
	},
};
