import React, { useState } from "react";
import Popover, { usePopoverContext } from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import { noop } from "lodash";
import { ValidationIcon } from "../../elements/validation";

const DismissButton = () => {
	const { handleDismiss } = usePopoverContext();
	return <Button type="button" variant="primary" onClick={ handleDismiss } className="yst-self-end">Got it!</Button>;
};
export const Factory = {
	render: ( args ) => {
		return (
			<>
				<div className="yst-relative">Element</div>
				<Popover { ...args } id="yst-popover" />
			</>

		);
	},
	parameters: {
		controls: { disable: true },
	},
	args: {
		children: (
			<Popover.Content id="yst-popover-content">
				Hey! I am the popover.
			</Popover.Content>
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
						<Popover.Title id="yst-popover-title"> The title </Popover.Title>
						<Popover.CloseButton screenReaderLabel="Dismiss" />
					</div>
					<div className="yst-self-start yst-flex-wrap">
						<Popover.Content
							id="yst-popover-content"
						>
							The content of the popover. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
							Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer
							took a galley of type and scrambled it to make a type specimen book.
						</Popover.Content>
					</div>
				</div>
			</>
		),
	},
	parameters: {
		controls: { disable: true },
	},
};

export const ButtonWithAPopover = {
	render: ( args ) => {
		const [ isVisible, setIsVisible ] = useState( false );

		const handleClick = () => setIsVisible( ! isVisible );

		return (
			<div className="yst-relative">
				<button
					/* eslint-disable-next-line react/jsx-no-bind */
					onClick={ handleClick } className="yst-border yst-bg-primary-500 yst-p-2 yst-rounded-lg yst-text-white yst-font-semibold"
				>
					Toggle popover
				</button>
				<Popover
					{ ...args }
					isVisible={ isVisible }
					setIsVisible={ setIsVisible }
					position={ args.position || "top-right" }
				/>
			</div>
		);
	},
	parameters: {
		controls: { disable: false },
	},
	args: {
		hasBackdrop: true,
		children: (
			<>
				<div className="yst-flex yst-gap-4">
					<div className="yst-flex-shrink-0">
						<ValidationIcon className="yst-w-5 yst-h-5" />
						<span className="yst-logo-icon" aria-label="Yoast Logo" role="img" />
					</div>
					<div className="yst-flex-1">
						<div className="yst-mb-5 yst-flex yst-justify-start">
							<Popover.Title id="yst-popover-title"> Popover title </Popover.Title>
						</div>
						<Popover.Content
							id="yst-popover-content"
							className="yst-text-slate-700 yst-font-normal yst-text-left"
						>
							The content of the popover. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						</Popover.Content>
					</div>
					<div>
						<Popover.CloseButton screenReaderLabel="Dismiss" />
					</div>
				</div>
				<div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
					<DismissButton />
				</div>
			</>
		),
	},
};

export default {
	title: "2) Components/Popover",
	component: Popover,
	argTypes: {
		children: { control: "text" },
	},
	args: {
		id: "yst-popover",
		isVisible: true,
		setIsVisible: noop,
		children: "",
		hasBackdrop: false,
	},
	parameters: {
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={ [ WithMoreContent, ButtonWithAPopover ] } />
			),
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-min-h-96 yst-flex yst-justify-center yst-items-center">
				<div className="yst-relative">
					<Story />
				</div>
			</div>
		),
	],
};
