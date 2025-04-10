import React, { useState } from "react";
import Popover, { usePopoverContext } from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import { noop } from "lodash";
import Badge from "../badge";
import { Icon } from "../../components/sidebar-navigation/icon";
import { YoastIcon } from "@yoast/related-keyphrase-suggestions/src/components/Modal/YoastIcon";
import { YoastLogo } from "@yoast/wordpress-seo/src/shared-admin/components";

const Template = ( {  isVisible: initialVisible, setIsVisible: _, position, children, ...props } ) => {
	return (
		<div className="yst-relative">
			<Popover
				id={ "popover" }
				position={ position }
				{ ...props }
			>
				{ children }
			</Popover>
		</div>
	);
};
Template.displayName = "Popover";

const DismissButton = () => {
	const { handleDismiss } = usePopoverContext();
	return <Button type="button" variant="primary" onClick={ handleDismiss } className="yst-self-end">Got it!</Button>;
};
export const Factory = {
	component: Template,
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: (
			<>
				<Popover.Content content={ "Hey! I am a popover" } />
			</>
		),
	},
	decorators: [
		( Story ) => (
			<div className="yst-flex yst-justify-center yst-items-center">
				<Story />
			</div>
		),
	],
};

export const WithMoreContent = {
	render: ( args ) => {
		return (
			<>
				<div className="yst-relative">
					<Popover { ...args } position="right" />
				</div>
			</>
		);
	},
	args: {
		children: (
			<>
				<div className="yst-flex yst-flex-col yst-gap-4">
					<div className="yst-flex yst-justify-between">
						<Popover.Title title={ "Popover title" } />
						<Popover.CloseButton dismissScreenReaderLabel="Dismiss" />
					</div>
					<div className="yst-self-start yst-flex-wrap">
						<Popover.Content
							content={ "Improve your content SEO. The content of the popover. " +
								"Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
								"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
								"when an unknown printer took a galley of type and scrambled it to make a type specimen book."
							}
						/>
					</div>
					<DismissButton />
				</div>
			</>
		),
	},
	parameters: {
		controls: { disable: true },
	},
	decorators: [
		( Story ) => (
			<div className="yst-m-40 yst-flex yst-justify-center yst-items-center">
				<Story />
			</div>
		),
	],
};

export const ButtonWithAPopover = {
	render: ( args ) => {
		const [ isOpen, setIsOpen ] = useState( args.isOpen );
		const handleClick = () => setIsOpen( ! isOpen );

		return (
			<>
				<button
					onClick={ handleClick } className="yst-relative yst-border yst-bg-primary-500 yst-p-2 yst-rounded-lg yst-text-white yst-font-semibold"
				>
					Toggle
					<Popover { ...args } isOpen={ isOpen } position={ "topLeft" } />
				</button>
			</>
		);
	},
	parameters: {
		controls: { disable: true },
	},
	args: {
		children: (
			<>
				<div className="yst-flex yst-flex-col yst-gap-4">
					<div className="yst-flex yst-justify-between">
						<Popover.Title title={ "Popover title" } />
						<Popover.CloseButton dismissScreenReaderLabel="Dismiss" />
					</div>
					<div className="yst-self-start yst-flex-wrap">
						<Popover.Content
							content={ "Improve your content SEO. The content of the popover. " +
								"Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
								"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
								"when an unknown printer took a galley of type and scrambled it to make a type specimen book."
							}
						/>
					</div>
					<DismissButton />
				</div>
			</>
		),
	},
	decorators: [
		( Story ) => (
			<div className="yst-m-40 yst-flex yst-justify-center yst-items-center">
				<Story />
			</div>
		),
	],
};

export default {
	title: "1) Elements/Popover",
	component: Template,
	argTypes: {
		isOpen: { control: "boolean" },
		children: {
			control: "text",
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		id: { control: "text" },
		isVisible: {
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "bool" } },
		},
		setIsVisible: {
			control: { disable: false },
			type: { required: true },
			table: { type: { summary: "func" } },
		},
		className: {
			control: "text",
			table: {
				type: { summary: "string" },
			},
		},
		position: {
			options: [ "top", "topLeft", "topRight", "right", "bottom", "left", "bottomLeft", "bottomRight" ],
			type: "select",
			description: "The position of the popover.",
			table: {
				defaultValue: { summary: "" },
			},
		},
	},
	tags: [ "autodocs" ],
	args: {
		id: "popover",
		isVisible: true,
		setIsVisible: noop,
		children: "",
		position: "",
	},
	parameters: {
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={ [ Factory, WithMoreContent, ButtonWithAPopover ] } />
			),
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-m-40 yst-flex yst-justify-center yst-items-center">
				<Story />
			</div>
		),
	],
};
