import React, { useState } from "react";
import Popover, { usePopoverContext } from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import { noop } from "lodash";

const Template = ( {  position, children, ...props } ) => {
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
				<Popover.Content
					content={ "Hey! I am a popover" }
				/>
			</>
		),
	},
};


export const WithMoreContent = {
	name: "With more content",
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
				</div>
			</>
		),
	},
};

export const ButtonWithAPopover = {
	render: ( args ) => {
		const [ isOpen, setIsOpen ] = useState( args.isOpen );
		const handleClick = () => setIsOpen( ! isOpen );

		return (
			<>
				<Button
					variant="primary"
					onClick={ handleClick } className="yst-relative"
				>
					Toggle Popover
					<Popover { ...args } isOpen={ isOpen } />
				</Button>
			</>
		);
	},
	parameters: {
		controls: { disable: false },
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
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "func" } },
		},
		className: {
			control: "text",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "" },
			},
		},
		position: {
			options: [ "top", "right", "bottom", "left" ],
			type: "select",
			description: "The position of the popover relative to it's parent.",
			table: {
				defaultValue: { summary: "right" },
			},
		},
	},
	tags: [ "autodocs" ],
	args: {
		id: "popover",
		isVisible: true,
		setIsVisible: noop,
		children: "",
		position: "right",
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

// export default {
// 	title: "1) Elements/Popover",
// 	component: Template,
// 	argTypes: {
// 		isOpen: { control: "boolean" },
// 	},
// 	tags: [ "autodocs" ],
// 	parameters: {
// 		docs: {
// 			description: { component },
// 			page: () => (
// 				<InteractiveDocsPage stories={ [ ButtonWithAPopover ] } />
// 			),
// 		},
// 	},
// 	decorators: [
// 		( Story ) => (
// 			<div className="yst-m-40 yst-flex yst-justify-center">
// 				<Story />
// 			</div>
// 		),
// 	],
// };
