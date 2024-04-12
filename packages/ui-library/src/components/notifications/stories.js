import { keys } from "lodash";
import React from "react";
import Notifications, { notificationClassNameMap } from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { childrenNotification, component, descriptionList, error, info, success, warning } from "./docs";

const Template = ( { position, ...args } ) => (
	<Notifications position={ position }>
		<Notifications.Notification { ...args } />
	</Notifications>
);

export const Factory = {
	render: Template.bind( {} ),
	args: {
		id: "notification-factory",
	},
	parameters: { controls: { disable: false } },
};

export const Info = {
	render: Template.bind( {} ),
	args: {
		variant: "info",
		id: "notification-info",
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: info } },
	},
};

export const Warning = {
	render: Template.bind( {} ),
	args: {
		variant: "warning",
		id: "notification-warning",
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: warning } },
	},
};

export const Success = {
	render: Template.bind( {} ),
	args: {
		variant: "success",
		id: "notification-success",
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: success } },
	},
};

export const Error = {
	render: Template.bind( {} ),
	args: {
		variant: "error",
		id: "notification-error",
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: error } },
	},
};

export const DescriptionList = {
	render: Template.bind( {} ),
	name: "Description list",
	argTypes: {
		description: { control: "array" },
	},
	args: {
		variant: "info",
		id: "notification-info",
		description: [ "Description 1", "Description 2", "Description 3" ],
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: descriptionList } },
	},
};

export const ChildrenNotification = {
	render: Template.bind( {} ),
	mame: "Children notification",
	args: {
		variant: "info",
		id: "notification-info",
		children: <b>Notification description as a component.</b>,
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: childrenNotification } },
	},
};

export default {
	title: "2) Components/Notifications",
	component: Notifications.Notification,
	argTypes: {
		children: { control: { disable: true } },
		position: {
			options: [ "bottom-center", "bottom-left", "top-center" ],
			type: "select",
			description: "The position of the notification. Notifications prop.",
			table: {
				defaultValue: { summary: "bottom-left" },
			},
		},
		id: { control: "text" },
		variant: {
			options: keys( notificationClassNameMap.variant ),
			type: "select",
			table: {
				type: { summary: keys( notificationClassNameMap.variant ).toString() },
			},
		},
		size: {
			options: keys( notificationClassNameMap.size ),
			type: "select",
			table: {
				type: { summary: keys( notificationClassNameMap.size ).toString() },
			},
		},
		title: { control: "text", type: "string" },
		description: { control: "text", type: "string" },
		onDismiss: { control: { disable: false } },
		autoDismiss: { type: "number", description: "Milliseconds for Notification to disappear." },
		dismissScreenReaderLabel: { control: "text", type: "string" },
	},
	args: {
		title: "Notification title",
		description: "Notification description",
		dismissScreenReaderLabel: "Dismiss",
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => <InteractiveDocsPage stories={ [ Info, Warning, Success, Error, DescriptionList, ChildrenNotification ] } />,
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
