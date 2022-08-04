/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { map } from "lodash";
import { useDispatch } from "@wordpress/data";
import { Notifications as NotificationsUi } from "@yoast/ui-library";
import { useSelectSettings } from "../store";
import { STORE_NAME } from "../constants";

/**
 * The Notifications component shows general notifications in the top-middle of the window.
 * @returns {JSX.Element} The Notifications component.
 */
const Notifications = () => {
	const { removeNotification } = useDispatch( STORE_NAME );
	const notifications = useSelectSettings( "selectNotifications" );
	const enrichedNotifications = useMemo( () => map( notifications, notification => ( {
		...notification,
		onDismiss: removeNotification,
		autoDismiss: notification.variant === "success" ? 5000 : null,
		dismissScreenReaderLabel: __( "Dismiss", "wordpress-seo" ),
	} ) ), [ notifications ] );

	return (
		<NotificationsUi notifications={ enrichedNotifications } position="bottom-left">
			{ enrichedNotifications.map( ( notification ) => (
				<NotificationsUi.Notification key={ notification.id } { ...notification } />
			) ) }
		</NotificationsUi>
	);
};

export default Notifications;
