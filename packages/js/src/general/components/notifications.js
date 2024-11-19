import { __, _n } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { BellIcon } from "@heroicons/react/outline";
import { Paper } from "@yoast/ui-library";
import { AlertsList } from "./alerts-list";
import { AlertsTitle } from "./alerts-title";
import { Collapsible } from "./collapsible";
import { AlertsContext } from "../contexts/alerts-context";
import { STORE_NAME } from "../constants/index";

/**
 * @returns {JSX.Element} The notifications component.
 */
export const Notifications = () => {
	const notificationsAlertsList = useSelect( ( select ) => select( STORE_NAME ).selectActiveNotifications(), [] );
	const hiddenNotificationsAlertsList = useSelect( ( select ) => select( STORE_NAME ).selectDismissedNotifications(), [] );
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
			<Paper.Content className="yst-max-w-[600px] yst-flex yst-flex-col yst-gap-y-6">
				<AlertsContext.Provider value={ { ...notificationsTheme } }>
					<AlertsTitle counts={ notificationsAlertsList.length } title={ __( "Notifications", "wordpress-seo" ) }>
						{ notificationsAlertsList.length === 0 && <p className="yst-mt-2 yst-text-sm">{ __( "No new notifications.", "wordpress-seo" ) }</p> }
					</AlertsTitle>
					<AlertsList items={ notificationsAlertsList } />

					{ hiddenNotifications > 0 && (
						<Collapsible label={ `${ hiddenNotifications } ${ hiddenNotificationLabel }` }>
							<AlertsList className="yst-pb-6" items={ hiddenNotificationsAlertsList } />
						</Collapsible>
					) }
				</AlertsContext.Provider>
			</Paper.Content>
		</Paper>
	);
};
