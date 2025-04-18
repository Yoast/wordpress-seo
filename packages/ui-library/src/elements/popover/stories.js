import React, { useState } from "react";
import Popover, { usePopoverContext } from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import { noop } from "lodash";
import { ValidationIcon } from "../validation";

const DismissButton = () => {
	const { handleDismiss } = usePopoverContext();
	return <Button type="button" variant="primary" onClick={ handleDismiss } className="yst-self-end">Got it!</Button>;
};
export const Factory = {
	component: Popover,
	render: ( args ) => {
		return (
			<Popover { ...args } id="yst-popover" />
		);
	},
	parameters: {
		controls: { disable: true },
	},
	args: {
		children: (
			<Popover.Content id="popover-content" content="Hey! I am a popover" />
		),
	},
};

export const WithBackdrop = {
	component: Popover,
	render: ( args ) => {
		return (
			<Popover { ...args } id="yst-popover"  backdrop="true" />
		);
	},
	parameters: {
		controls: { disable: true },
	},
	args: {
		children: (
			<Popover.Content id="popover-content" content="Hey! I am a popover" />
		),
	},
};

export const WithMoreContent = {
	render: ( args ) => {
		const [ isVisible, setIsVisible ] = useState( true );

		return (
			<>
				{ isVisible && <Popover
					{ ...args }
					isVisible={ isVisible }
					setIsVisible={ setIsVisible }
					isOpen={ isVisible }
					position={ args.position }
				/> }
			</>
		);
	},
	args: {
		children: (
			<>
				<div className="yst-flex yst-flex-col yst-gap-4">
					<div className="yst-flex yst-justify-between">
						<Popover.Title title="Popover title"  id="popover-title" />
						<Popover.CloseButton dismissScreenReaderLabel="Dismiss" />
					</div>
					<div className="yst-self-start yst-flex-wrap">
						<Popover.Content
							id="popover-content"
							content="Improve your content SEO. The content of the popover.
								Lorem Ipsum is simply dummy text of the printing and typesetting industry.
								Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
								when an unknown printer took a galley of type and scrambled it to make a type specimen book."
						/>
					</div>
				</div>
			</>
		),
	},
	parameters: {
		controls: { disable: true },
	},
	decorators: [
		( Story ) => (
			<div className="yst-min-h-64">
				<Story />
			</div>
		),
	],
};

export const ButtonWithAPopover = {
	render: ( args ) => {
		const [ isVisible, setIsVisible ] = useState( false );

		const handleClick = () => setIsVisible( ! isVisible );

		return (
			<>
				<button
					/* eslint-disable-next-line react/jsx-no-bind */
					onClick={ handleClick } className="yst-relative yst-border yst-bg-primary-500 yst-p-2 yst-rounded-lg yst-text-white yst-font-semibold"
				>
					Toggle popover
					<Popover
						{ ...args }
						isVisible={ isVisible }
						setIsVisible={ setIsVisible }
						position={ args.position || "topLeft" }
					/>
				</button>
			</>
		);
	},
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: (
			<>
				<div className="yst-flex yst-gap-4">
					<div className="yst-flex-shrink-0">
						<ValidationIcon className="yst-w-5 yst-h-5" />
					</div>
					<div className="yst-flex-1">
						<div className="yst-mb-5 yst-flex yst-justify-start">
							<Popover.Title title="Popover title" id="popover-title" />
						</div>
						<Popover.Content
							id="popover-content"
							content="Improve your content SEO. The content of the popover.
								Lorem Ipsum is simply dummy text of the printing and typesetting industry.
								Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
								when an unknown printer took a galley of type and scrambled it to make a type specimen book."
							className="yst-text-slate-700 yst-font-normal yst-text-left"
						/>
					</div>
					<div>
						<Popover.CloseButton dismissScreenReaderLabel="Dismiss" />
					</div>
				</div>
				<div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
					<DismissButton />
				</div>
			</>
		),
	},
	decorators: [
		( Story ) => (
			<div className="yst-m-72 yst-flex yst-justify-center">
				<Story />
			</div>
		),
	],
};

export default {
	title: "1) Elements/Popover",
	component: Popover,
	argTypes: {
		as: { options: [ "div", "span" ] },
		children: {
			control: "text",
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		isVisible: {
			control: { disable: false },
			type: { required: true },
			table: {
				type: { summary: "bool" },
				defaultValue: { summary: true },
			},
		},
		backdrop: {
			control: { type: "boolean" },
			defaultValue: false,
			type: { required: false },
			table: {
				type: { summary: "bool" },
				defaultValue: { summary: false },
			},
		},
	},
	args: {
		id: "yst-popover",
		isVisible: true,
		setIsVisible: noop,
		children: "",
		position: "",
		backdrop: false,
	},
	parameters: {
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={ [ WithBackdrop, WithMoreContent, ButtonWithAPopover ] } />
			),
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-min-h-64 yst-flex yst-justify-center yst-items-center">
				<div className="yst-relative">
					<Story />
				</div>
			</div>
		),
	],
};
