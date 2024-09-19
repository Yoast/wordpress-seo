import { __, _n } from "@wordpress/i18n";
import { BellIcon } from "@heroicons/react/outline";
import { Paper } from "@yoast/ui-library";
import { List } from "./list";
import { BoxTitle } from "./box-title";
import { HiddenAlertsCollapsible } from "./hidden-alerts-collapsible";

/**
 * @returns {JSX.Element} The notifications component.
 */
export const Notifications = () => {
	const notificationsList = [
		{
			message: __( "Your site is not connected to your MyYoast account. Connect your site to get access to all the features.", "wordpress-seo" ),
		},
		{
			message: __( "You have a new notification from Yoast SEO. Click here to read it.", "wordpress-seo" ),
		},
	];

	const hiddenNotificatins = 1;

	const hiddenNotificationLabel = _n(
		"hidden notification.",
		"hidden notifications.",
		hiddenNotificatins,
		"wordpress-seo"
	);

	return (
		<Paper className="yst-p-8 yst-flex-1 yst-flex-col">
			<BoxTitle title={ __( "Notifications", "wordpress-seo" ) } counts={ 2 } Icon={ BellIcon } iconColor="blue" />
			<List items={ notificationsList } bulletColor="blue" hidden={ false } />

			<HiddenAlertsCollapsible label={ `${ hiddenNotificatins } ${ hiddenNotificationLabel }` }>
				<List items={ notificationsList } bulletColor="blue" hidden={ true } />
			</HiddenAlertsCollapsible>
		</Paper>
	);
};
