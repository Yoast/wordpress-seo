import { __, _n } from "@wordpress/i18n";
import { BellIcon } from "@heroicons/react/outline";
import { Paper } from "@yoast/ui-library";
import { AlertsList } from "./alerts-list";
import { AlertTitle } from "./alert-title";
import { Collapsible } from "./collapsible";
import { AlertsContext } from "../routes/alert-center";

/**
 * @returns {JSX.Element} The notifications component.
 */
export const Notifications = () => {
	const notificationsAlertsList = [
		{
			message: __( "Your site is not connected to your MyYoast account. Connect your site to get access to all the features.", "wordpress-seo" ),
		},
		{
			message: __( "You have a new notification from Yoast SEO. Click here to read it.", "wordpress-seo" ),
		},
	];

	const hiddenNotifications = 1;

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
		<Paper className="yst-p-8 yst-flex-1 yst-flex-col">
			<AlertsContext.Provider value={ notificationsTheme }>
				<AlertTitle counts={ 2 } title={ __( "Notifications", "wordpress-seo" ) } />
				<AlertsList items={ notificationsAlertsList } hidden={ false } />

				<Collapsible label={ `${ hiddenNotifications } ${ hiddenNotificationLabel }` }>
					<AlertsList items={ notificationsAlertsList } hidden={ true } />
				</Collapsible>
			</AlertsContext.Provider>
		</Paper>
	);
};
