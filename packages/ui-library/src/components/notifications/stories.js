import Notifications, { Notification, notificationClassNameMap, notificationsClassNameMap, notificationsIconMap } from ".";
import { keys } from "lodash";

export default {
	title: "2. Components/Notifications",
	component: Notification,
	argTypes: {
		children: { control: { disable: true } },
		position: {
			options: [ "bottom-center", "bottom-left", "top-center", "inherit" ],
			type: "select",
			description: "The position of the notification. Notifications prop.",
		},
		id: { control: "text" },
		variant: { options: keys( notificationClassNameMap.variant ), type: "select" },
		size: { options: keys( notificationClassNameMap.size ), type: "select" },
		title: { control: "text", type: "string" },
		description: { control: "text", type: "string" },
		onDismiss: { control: { disable: false } },
		autoDismiss: { type: "number", description: "Miliseconds for Notification to dissapear." },
		dismissScreenReaderLabel: { control: "text", type: "string" },
	},
	args: {
		title: "Notification title",
		description: "Notifiation description",
		id: "notification-single",
		dismissScreenReaderLabel: "Dismiss",

	},
	parameters: {
		docs: {
			description: {
				component: "The Notifications component shows notifications on a specified position on the screen. Switch location in the control panel.",
			},
		},
	},
};

const Template = ( args ) =>
	// eslint-disable-next-line no-negated-condition
	<div className={ args.position !== "inherit" ? "yst-fixed yst-left-0" : "" }>
		<Notifications position={ args.position }>
			<Notifications.Notification { ...args } />
		</Notifications>
	</div>;


export const Factory = Template.bind( {} );
Factory.args = {
	 position: "inherit",
	 onDismiss: () => {},
};

export const Info = Template.bind( {} );
Info.args = {
	variant: "info",
	position: "inherit",
	id: "notification-info",
};

export const Warning = Template.bind( {} );
Warning.args = {
	variant: "warning",
	position: "inherit",
	id: "notification-warning",
};

export const Success = Template.bind( {} );
Success.args = {
	variant: "success",
	position: "inherit",
	id: "notification-success",
};

export const Error = Template.bind( {} );
Error.args = {
	variant: "error",
	position: "inherit",
	id: "notification-error",

};

export const DescriptionList = Template.bind( {} );
DescriptionList.args = {
	variant: "info",
	position: "inherit",
	id: "notification-info",
	description: [ "Description 1", "Description 2", "Description 3" ],
};

DescriptionList.parameters = { docs: { description: { story: "Description can be an array of strings." } } };

export const ChildrenNotification = Template.bind( {} );

const DescriptionChild = () => <b>Notification description as a component.</b>;

ChildrenNotification.args = {
	variant: "info",
	position: "inherit",
	id: "notification-info",
	children: <DescriptionChild />,
};

ChildrenNotification.parameters = { docs: { description: { story: "`children` prop in `Notifications.Notification` subcomponent, takes the place of `description` value and accepts React components." } } };


