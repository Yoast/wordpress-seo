import { DropdownMenu } from ".";
import React from "react";
import { XIcon, TrashIcon } from "@heroicons/react/outline";
import { component } from "./docs";

export const Factory = {
	render: ( args ) =>  <DropdownMenu { ...args } />,
	args: {
		children: (
			<>
				<DropdownMenu.Item as="div" className="yst-text-slate-600">
					Item
				</DropdownMenu.Item>
				<DropdownMenu.Item as="div" className="yst-text-red-500">
					Item
				</DropdownMenu.Item>
				<DropdownMenu.ButtonItem className="yst-text-slate-600">
					<XIcon className="yst-w-4 yst-text-slate-400" />
					Button Item
				</DropdownMenu.ButtonItem>
				<DropdownMenu.ButtonItem className="yst-text-red-500">
					<TrashIcon className="yst-w-4" />
					Button Item
				</DropdownMenu.ButtonItem>
			</>
		),
		screenReaderTriggerLabel: "Open menu",
	},
};


export default {
	title: "2) Components/DropdownMenu",
	component: DropdownMenu,
	argTypes: {
		children: { control: "text" },
		screenReaderTriggerLabel: { control: "text" },
		menuTrigger: { control: "text" },
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-pb-32">
				<Story />
			</div>
		),
	],
};
