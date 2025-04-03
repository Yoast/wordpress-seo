import { DropdownMenu } from ".";
import React from "react";
import { XIcon, TrashIcon } from "@heroicons/react/outline";
import { component } from "./docs";

export const Factory = {
	render: () => <DropdownMenu>
		<DropdownMenu.IconTrigger screenReaderTriggerLabel="Open menu" />
		<DropdownMenu.List>
			<DropdownMenu.Item as="div" className="yst-text-slate-600">
				{ ( { active } ) => (
					<div className={ active ? "yst-bg-slate-100" : "" }>Item</div>
				) }
			</DropdownMenu.Item>
			<DropdownMenu.Item as="div" className="yst-text-red-500">
				{ ( { active } ) => (
					<div className={ active ? "yst-bg-slate-100" : "" }>Item</div>
				) }
			</DropdownMenu.Item>
			<DropdownMenu.ButtonItem className="yst-text-slate-600 yst-border-b yst-border-slate-200 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4">
				<XIcon className="yst-w-4 yst-text-slate-400" />
				Button Item
			</DropdownMenu.ButtonItem>
			<DropdownMenu.ButtonItem className="yst-text-red-500 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4">
				<TrashIcon className="yst-w-4" />
				Button Item
			</DropdownMenu.ButtonItem>
		</DropdownMenu.List>
	</DropdownMenu>,
};


export default {
	title: "2) Components/DropdownMenu",
	component: DropdownMenu,
	argTypes: {
		children: { control: "text" },
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
