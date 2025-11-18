import { TaskRow, TaskModal } from "@yoast/dashboard-frontend";
import { useToggleState } from "@yoast/ui-library";
import { useCallback } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { get } from "lodash";

/**
 * The Task component to display a task row and modal.
 *
 * @param {string} title The title of the task.
 * @param {string} id The ID of the task.
 * @param {string} how The how copy.
 * @param {string} why The why copy.
 * @param {number} duration The duration in minutes.
 * @param {string} priority The priority: 'low', 'medium', 'high'.
 * @param {boolean} isCompleted Whether the task is completed.
 * @param {Function} onClick Function to call when the row is clicked.
 * @param {Object} callToAction The call to action props object.
 *
 * @returns {JSX.Element} The Task component.
 */
export const Task = ( { title, id, how, why, duration, priority, isCompleted, callToAction } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( false );
	const { completeTask } = useDispatch( STORE_NAME );
	const status = useSelect( ( select ) => select( STORE_NAME ).getTaskStatus(), [] );

	const nonce = get( window, "wpseoScriptData.dashboard.nonce", "" );

	const handleCompleteTask = useCallback( async() => {
		completeTask( id, "/wp-json/yoast/v1/complete_task", nonce );
	}, [ nonce ] );

	const callToActionProps = {
		onClick: handleCompleteTask,
		...callToAction,
	};
	return <>
		<TaskRow
			title={ title }
			duration={ duration }
			priority={ priority }
			isCompleted={ isCompleted }
			onClick={ toggleOpen }
		/>
		<TaskModal
			isOpen={ isOpen }
			onClose={ toggleOpen }
			title={ title }
			duration={ duration }
			priority={ priority }
			why={ why }
			how={ how }
			isCompleted={ isCompleted }
			taskId={ id }
			callToAction={ callToActionProps }
			isLoading={ status === ASYNC_ACTION_STATUS.loading }
		/>
	</>;
};
