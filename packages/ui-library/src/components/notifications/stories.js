import Notifications, { Notification, notificationClassNameMap } from ".";
import { keys } from "lodash";

export default {
	title: "2) Components/Notifications",
	component: Notification,
	argTypes: {
		children: { control: "text" },
		position: {
			options: [ "bottom-center", "bottom-left", "top-center" ],
			type: "select",
			description: "The position of the notification. Notifications prop.",
			table: {
				defaultValue: { summary: "bottom-center" },
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
				component: "The Notifications component shows notifications on a specified position on the screen. Switch `position` in the control panel to view.",
			},
		},
	},
};

const Template = ( args ) => <Notifications.Notification { ...args } />;

export const Factory = ( args ) =>
	<>
		<div className="yst-mb-3">Default position is bottom-left.</div>
		<div className="yst-fixed yst-left-0 yst-z-50">
			<Notifications position={ args.position }>
				<Notifications.Notification { ...args } />
			</Notifications>
		</div>
	</>
	;
Factory.args = {
	id: "notification-factory",
	 onDismiss: () => {},
};

export const Info = Template.bind( {} );
Info.args = {
	variant: "info",
	id: "notification-info",
};

export const Warning = Template.bind( {} );
Warning.args = {
	variant: "warning",
	id: "notification-warning",
};

export const Success = Template.bind( {} );
Success.args = {
	variant: "success",
	id: "notification-success",
};

export const Error = Template.bind( {} );
Error.args = {
	variant: "error",
	id: "notification-error",

};

export const DescriptionList = Template.bind( {} );
DescriptionList.storyName = "Description list";
DescriptionList.args = {
	variant: "info",
	id: "notification-info",
	description: [ "Description 1", "Description 2", "Description 3" ],
};

DescriptionList.parameters = { docs: { description: { story: "Description can be an array of strings." } } };

export const ChildrenNotification = Template.bind( {} );
ChildrenNotification.storyName = "Children notification";
const DescriptionChild = () => <b>Notification description as a component.</b>;

ChildrenNotification.args = {
	variant: "info",
	id: "notification-info",
	children: <DescriptionChild />,
};

ChildrenNotification.parameters = { docs: { description: { story: "`children` prop in `Notifications.Notification` subcomponent, takes the place of `description` value and accepts React components." } } };


