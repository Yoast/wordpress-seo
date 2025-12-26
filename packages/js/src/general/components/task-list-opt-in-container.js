import { TaskListOptInNotification } from "./task-list-opt-in-notification";
import { useSelectGeneralPage } from "../hooks";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

export const TaskListOptInContainer = () => {
	const taskListOptInNotificationSeen = useSelectGeneralPage( "selectIsOptInNotificationSeen", [], "task_list" );
	const { pathname } = useLocation();

	if ( pathname === ROUTES.firstTimeConfiguration || taskListOptInNotificationSeen ) {
		return null;
	}
	return (
		<div>
			<TaskListOptInNotification />
		</div>
	);
};
