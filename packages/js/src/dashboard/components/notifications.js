import { __, _n } from "@wordpress/i18n";
import { BellIcon } from "@heroicons/react/outline";
import { Paper } from "@yoast/ui-library";
import { AlertsList } from "./alerts-list";
import { AlertTitle } from "./alert-title";
import { Collapsible } from "./collapsible";
import { AlertsContext } from "../contexts/alerts-context";

/**
 * @returns {JSX.Element} The notifications component.
 */
export const Notifications = () => {
	const notificationsAlertsList = [
		{
			message: "Your site is not connected to your MyYoast account. Connect your site to get access to all the features.",
		},
		{
			message: "You have a new notification from Yoast SEO. Click here to read it.",
		},
	];

	const hiddenNotificationsAlertsList = [
		{
			message: "Your site is not connected to your MyYoast account. Connect your site to get access to all the features.",
		},
		{
			message: "You have a new notification from Yoast SEO. Click here to read it.",
		},
	];

	const hiddenNotifications = hiddenNotificationsAlertsList.length;

	const hiddenNotificationLabel = _n(
		"hidden notification",
		"hidden notifications",
		hiddenNotifications,
		"wordpress-seo"
	);

	const notificationsTheme = {
		Icon: BellIcon,
		bulletClass: "yst-fill-blue-500",
		iconClass: "yst-text-blue-500",
	};

	return (
		<Paper>
			<Paper.Content className="yst-flex yst-flex-col yst-gap-y-6">
				<AlertsContext.Provider value={ notificationsTheme }>
					<AlertTitle counts={ 2 } title={ __( "Notifications", "wordpress-seo" ) } />
					<AlertsList items={ notificationsAlertsList } hidden={ false } />

					{ hiddenNotifications > 0 && (
						<Collapsible label={ `${ hiddenNotifications } ${ hiddenNotificationLabel }` }>
							<AlertsList className="yst-pb-6" items={ hiddenNotificationsAlertsList } hidden={ true } />
						</Collapsible>
					) }
				</AlertsContext.Provider>
			</Paper.Content>
		</Paper>
	);
};
