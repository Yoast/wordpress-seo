import React, { useState } from "react";
import Popover from "./index";
import { component } from "./docs";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import { title } from "../toast/docs";
import { useToggleState } from "../../hooks";


const Template = ( { isVisible: initialVisible, setIsVisible: _, position, children, ...props } ) => {
	const [ isVisible, toggleToast, , openToast ] = useToggleState( initialVisible );
	return (
		<>
			<Popover
				{ ...props }
				isVisible={ isVisible }
				setIsVisible={ openToast }
				onDismiss={ toggleToast }
				className="yst-max-w-96"
			/>
		</>
	);
};

// export const Factory = {
// 	component: Template,
// 	parameters: {
// 		controls: { disable: false },
// 	},
// };


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

export const WithMoreContent = {
	component: Factory,
	parameters: {
		controls: { disable: false },
		docs: { description: { story: title } },
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
						<Popover.Content content={ "Improve your content SEO.The content of the popover. dajrsoasidfjasldfja;osdifja;sldfkmja;osldfjaosijfda;sldfja;olsdfja;lsdfj;aosdifja;lsdfjasojifd" } className="yst-text-wrap" />
					</div>
					<Button type="button" variant="primary" className="yst-self-end">Got it!</Button>
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
				<div className="yst-flex yst-flex-col yst-gap-4">
					<div className="yst-flex yst-justify-between">
						<Popover.Title title={ "Popover title" } />
						<Popover.CloseButton dismissScreenReaderLabel="Dismiss" />
					</div>
					<div className="yst-self-start yst-flex-wrap">
						<Popover.Content content={ "Improve your content SEO.The content of the popover. dajrsoasidfjasldfja;osdifja;sldfkmja;osldfjaosijfda;sldfja;olsdfja;lsdfj;aosdifja;lsdfjasojifd" } className="yst-text-wrap" />
					</div>
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
