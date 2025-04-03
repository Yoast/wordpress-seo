import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { updateNotificationsCount } from "../../shared-admin/helpers";
import { STORE_NAME } from "../constants";

/**
 * Sync the notification count with the Yoast menu and admin bar.
 * @returns {void}
 */
export const useNotificationCountSync = () => {
	const activeAlertCount = useSelect( ( select ) => select( STORE_NAME ).selectActiveAlertsCount(), [] );

	useEffect( () => {
		updateNotificationsCount( activeAlertCount );
	}, [ activeAlertCount ] );
};
