import React from "react";
import Popover, { usePopoverContext } from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";

const DismissButton = () => {
	const { handleDismiss } = usePopoverContext();
	return <Button
		type="button" variant="primary"
		popovertargetaction="hide"
		popovertarget="yst-popover"
		className="yst-self-end"
	>Got it!</Button>;
};
export const Factory = {
	render: ( args ) => {
		return (
			<>
				<Button variant="primary" id="popover-trigger" popovertarget="yst-popover" className="yst-z-20">
					Toggle
					<Popover id="yst-popover" position="right" { ...args } />
				</Button>
			</>
		);
	},
	args: {
		children: (
			<>
				<div className="yst-flex yst-flex-col yst-gap-4">
					<Popover.Content
						content={ "The content of the popover." }
					/>
				</div>
			</>
		),
	},
	parameters: {
		controls: { disable: false },
	},
};

export const WithMoreContent = {
	render: ( args ) => {
		// const handleClick = () => {
		// 	const popover = document.querySelector( "[popover]" );
		// 	popover
		// 		? console.log( "Popover is open", popover )
		// 		: console.log( "No popover found" );
		// };

		return (
			<>
				<Button variant="primary" id="popover-trigger" popovertarget="yst-popover">
					Toggle
					<Popover id="yst-popover" position="right" { ...args } />
				</Button>
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
};

export default {
	title: "1) Elements/Popover",
	component: Popover,
	tags: [ "autodocs" ],
	// args: {
	// 	id: "yst-popover",
	// 	position: "",
	// },
	parameters: {
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={ [ WithMoreContent ] } />
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
