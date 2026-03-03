import { TaskListOptInNotification } from "./task-list-opt-in-notification";
import { useSelectGeneralPage } from "../hooks";
import { useLocation } from "react-router-dom";
import { useCallback } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { ROUTES } from "../routes";
import { STORE_NAME } from "../constants";

/**
 * The container for the opt-in notification.
 * Used to decide whether to show the opt-in notification or not.
 *
 * @returns {JSX.Element|null} The container component.
 */
export const OptInContainer = () => {
	const taskListOptInNotificationSeen = useSelectGeneralPage( "selectIsOptInNotificationSeen", [], "task_list" );
	const { pathname } = useLocation();
	const { hideOptInNotification } = useDispatch( STORE_NAME );

	const isOpen = pathname !== ROUTES.firstTimeConfiguration && ! taskListOptInNotificationSeen && pathname !== ROUTES.taskList;

	const onClose = useCallback( () => {
		hideOptInNotification( "task_list" );
	}, [ hideOptInNotification ] );

	return <TaskListOptInNotification isOpen={ isOpen } onClose={ onClose } />;
};
