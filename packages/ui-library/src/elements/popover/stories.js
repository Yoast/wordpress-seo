import React, { useState } from "react";
import Popover from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import Toast from "../../elements/toast";

export const Factory = {
	render: ( args ) => {
		return (
			<>
				<Popover { ...args } isOpen={ true } />
			</>
		);
	},
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "I am just a popover",
	},
};


export const ButtonWithAPopover = {

	render: ( args ) => {
		const [ isOpen, setIsOpen ] = useState( args.isOpen );
		const handleClick = () => setIsOpen( ! isOpen );

		return (
			<>
				<Button type="button" onClick={ handleClick } className="yst-relative">
					Toggle Popover
				</Button>
				<Popover { ...args } isOpen={ isOpen } />
			</>
		);
	},
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: (
			<>
				<div className="">
					<Toast.Title title={ "Popover title" } className="" />
					<p>Improve your content SEO</p>
					<Button type="button" variant="primary" className="yst-self-end">Got it!</Button>
				</div>
			</>
		),
	},
};
export default {
	title: "1) Elements/Popover",
	component: Popover,
	argTypes: {
		isOpen: { control: "boolean" },
	},
	tags: [ "autodocs" ],
	parameters: {
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={ [ ButtonWithAPopover ] } />
			),
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-m-20 yst-flex yst-justify-center">
				<Story />
			</div>
		),
	],
};
