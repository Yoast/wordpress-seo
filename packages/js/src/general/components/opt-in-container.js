import { TaskListOptInNotification } from "./task-list-opt-in-notification";
import { useSelectGeneralPage } from "../hooks";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * The container for the opt-in notification.
 * Used to decide whether to show the opt-in notification or not.
 *
 * @returns {JSX.Element|null} The container component.
 */
export const OptInContainer = () => {
	const taskListOptInNotificationSeen = useSelectGeneralPage( "selectIsOptInNotificationSeen", [], "task_list" );
	const { setOptInNotificationSeen, hideOptInNotification } = useDispatch( STORE_NAME );
	const { pathname } = useLocation();

	if ( pathname === ROUTES.taskList ) {
		setOptInNotificationSeen( "task_list" );
		hideOptInNotification( "task_list" );
		return null;
	}

	if ( pathname === ROUTES.firstTimeConfiguration || taskListOptInNotificationSeen ) {
		return null;
	}
	return (
		<div>
			<TaskListOptInNotification />
		</div>
	);
};
