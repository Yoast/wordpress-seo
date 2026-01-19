import { TaskListOptInNotification } from "./task-list-opt-in-notification";
import { useSelectGeneralPage } from "../hooks";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

/**
 * The container for the opt-in notification.
 * Used to decide whether to show the opt-in notification or not.
 *
 * @returns {JSX.Element|null} The container component.
 */
export const OptInContainer = () => {
	const taskListOptInNotificationSeen = useSelectGeneralPage( "selectIsOptInNotificationSeen", [], "task_list" );
	const { pathname } = useLocation();

	if ( pathname === ROUTES.firstTimeConfiguration || taskListOptInNotificationSeen || pathname === ROUTES.taskList ) {
		return null;
	}

	return (
		<div>
			<TaskListOptInNotification />
		</div>
	);
};
