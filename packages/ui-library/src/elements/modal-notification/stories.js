import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import ModalNotification, { modalNotificationClassNameMap, useModalNotificationContext } from ".";
import Button from "../../elements/button";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";
import { ValidationIcon } from "../validation";

const Template = ( { isOpen: initialIsOpen = false, onClose: _ = noop, children, ...props } ) => {
	const [ isOpen, setIsOpen ] = useState( initialIsOpen );
	const openDialog = useCallback( () => setIsOpen( true ), [] );
	const closeDialog = useCallback( () => setIsOpen( false ), [] );

	return (
		<>
			<Button onClick={ openDialog }>Open modal notification</Button>
			<ModalNotification { ...props } isOpen={ isOpen } onClose={ closeDialog }>
				<ModalNotification.Panel>
					{ children }
				</ModalNotification.Panel>
			</ModalNotification>
		</>
	);
};
Template.displayName = "ModalNotification";
Template.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	children: PropTypes.node,
};

export const Factory = {
	component: Template,
	args: {
		"aria-label": "Notification",
		children: (
			<div className="yst-flex">
				<div className="yst-flex-1">
					<p>Hello everyone!</p>
				</div>
				<div>
					<ModalNotification.Close dismissScreenReaderLabel="Dismiss" />
				</div>
			</div>
		),
	},
	parameters: {
		controls: { disable: false },
	},
};

const ConfirmButton = () => {
	const { handleDismiss } = useModalNotificationContext();
	return <Button size="small" onClick={ handleDismiss }>Confirm</Button>;
};

const DismissButton = () => {
	const { handleDismiss } = useModalNotificationContext();
	return <Button size="small" variant="tertiary" onClick={ handleDismiss }>Dismiss</Button>;
};

export const asComplexLayout = {
	name: "Complex layout",
	args: {
		role: "alertdialog",
		children: (
			<>
				<div className="yst-flex yst-gap-3">
					<div className="yst-flex-shrink-0">
						<ValidationIcon className="yst-w-5 yst-h-5" />
					</div>
					<div className="yst-flex-1">
						<ModalNotification.Title title="Perform an action?" />
						<ModalNotification.Message message="An optional action can be performed. Please confirm this action. Otherwise, feel free to dismiss this suggestion." />
					</div>
					<div>
						<ModalNotification.Close dismissScreenReaderLabel="Dismiss" />
					</div>
				</div>
				<div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
					<DismissButton />
					<ConfirmButton />
				</div>
			</>
		),
	},
	parameters: {
		controls: { disable: false },
	},
	decorators: [
		( Story ) => (
			<div className="yst-min-h-[21rem]">
				<Story />
			</div>
		),
	],
};

export default {
	title: "1) Elements/Modal notification",
	component: Template,
	argTypes: {
		children: {
			control: "text",
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		isOpen: {
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "bool" } },
		},
		onClose: {
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
			options: Object.keys( modalNotificationClassNameMap.position ),
			type: "select",
			description: "The position of the modal notification.",
			table: {
				defaultValue: { summary: "bottom-left" },
			},
		},
		initialFocus: {
			control: { disable: true },
			type: { required: false },
			description: "A ref to the element that should receive focus when the modal notification opens.",
			table: {
				type: { summary: "func | object" },
				defaultValue: { summary: "null" },
			},
		},
		role: {
			options: [ "dialog", "alertdialog" ],
			type: "select",
			description: "Forwarded to HeadlessUI Dialog. Use \"alertdialog\" for notifications requiring immediate user response.",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "dialog" },
			},
		},
		"aria-label": {
			control: "text",
			description: "Forwarded to HeadlessUI Dialog. Required when ModalNotification.Title is not used.",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "null" },
			},
		},
	},
	args: {
		isOpen: false,
		onClose: noop,
		position: "bottom-left",
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => (
				<InteractiveDocsPage
					stories={ [
						asComplexLayout,
					] }
				/>
			),
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-min-h-[12rem]">
				<Story />
			</div>
		),
	],
};
