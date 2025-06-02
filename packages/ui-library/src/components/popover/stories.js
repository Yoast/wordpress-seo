import React, { Fragment, useEffect, useCallback } from "react";
import Popover, { usePopoverContext } from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import { noop } from "lodash";
import { ValidationIcon } from "../../elements/validation";
import { useArgs } from "@storybook/preview-api";

const DismissButton = () => {
	const { handleDismiss } = usePopoverContext();
	return <Button type="button" variant="primary" onClick={ handleDismiss } className="yst-self-end">Got it!</Button>;
};
export const Factory = {
	args: {
		children: (
			<>
				<Popover.Title>The title</Popover.Title>
				<Popover.Content>
					Hey! I am the popover.
				</Popover.Content>
			</>
		),
	},
};

export const WithMoreContent = {
	args: {
		children: (
			<div className="yst-flex yst-flex-col yst-gap-4">
				<div className="yst-flex yst-justify-between">
					<Popover.Title>The title</Popover.Title>
					<Popover.CloseButton screenReaderLabel="Dismiss" />
				</div>
				<div className="yst-self-start yst-flex-wrap">
					<Popover.Content>
						The content of the popover. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the standard dummy text ever since the 1500s.
					</Popover.Content>
				</div>
			</div>
		),
	},
	decorators: [
		( Story ) => {
			const [ args, updateArgs ] = useArgs();
			const setIsVisible = useCallback( ( isVisible ) => {
				updateArgs( { isVisible } );
			}, [ updateArgs ] );

			useEffect( () => {
				updateArgs( { setIsVisible } );
			}, [ setIsVisible ] );

			return <Story { ...args } />;
		},
	],
};

export const ButtonWithAPopover = {
	args: {
		isVisible: false,
		hasBackdrop: true,
		position: "top-right",
		children: (
			<>
				<div className="yst-flex yst-gap-4">
					<div className="yst-flex-shrink-0">
						<ValidationIcon className="yst-w-5 yst-h-5" />
						<span className="yst-logo-icon" aria-label="Yoast Logo" role="img" />
					</div>
					<div className="yst-flex-1">
						<div className="yst-mb-5 yst-flex yst-justify-start">
							<Popover.Title>Popover title</Popover.Title>
						</div>
						<Popover.Content>
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
	decorators: [
		( Story ) => {
			const [ args, updateArgs ] = useArgs();

			const setIsVisible = useCallback( ( isVisible ) => {
				updateArgs( { isVisible } );
			}, [ updateArgs ] );

			useEffect( () => {
				updateArgs( { setIsVisible } );
			}, [ setIsVisible ] );

			const handleClick = () => setIsVisible( ! args.isVisible );

			return (
				<>
					<button
						// eslint-disable-next-line react/jsx-no-bind
						onClick={ handleClick }
						className="yst-border yst-bg-primary-500 yst-p-2 yst-rounded-lg yst-text-white yst-font-semibold"
					>
						Toggle popover
					</button>
					<Story{ ...args } />
				</>
			);
		},
	],
};

export default {
	title: "2) Components/Popover",
	component: Popover,
	argTypes: {
		children: { control: "text" },
	},
	args: {
		isVisible: true,
		setIsVisible: noop,
		children: "",
		hasBackdrop: false,
		"aria-label": "Popover",
	},
	parameters: {
		controls: {
			disable: false,
		},
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={ [ WithMoreContent, ButtonWithAPopover ] } />
			),
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-flex yst-justify-center yst-items-center yst-h-[30rem]">
				<div className="yst-relative">
					<Story />
				</div>
			</div>
		),
	],
};
