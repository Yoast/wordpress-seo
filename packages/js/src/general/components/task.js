import { TaskRow, TaskModal } from "@yoast/dashboard-frontend";
import { useToggleState } from "@yoast/ui-library";
import { useCallback } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

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
 * @param {Object} callToAction The call-to-action props object.
 * @param {string} [badge] An optional badge to display next to the task title: `premium`, `woo`, `ai`.
 * @param {string} [className] Additional CSS classes for the row.
 * @param {Function} [onModalOpen] Callback function when modal opens.
 * @param {Function} [onModalClose] Callback function when modal closes.
 *
 * @returns {JSX.Element} The Task component.
 */
export const Task = ( { title, id, how, why, duration, priority, isCompleted, callToAction, badge, className, onModalOpen, onModalClose } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( false );
	const { completeTask } = useDispatch( STORE_NAME );
	const { status, completeTaskEndpoint, nonce } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			status: state.selectTaskStatus( id ),
			completeTaskEndpoint: state.selectTasksEndpoints().completeTask,
			nonce: state.selectNonce(),
		};
	}, [] );

	const handleCompleteTask = useCallback( async() => {
		completeTask( id, completeTaskEndpoint, nonce );
	}, [ nonce ] );

	const handleModalOpen = useCallback( () => {
		toggleOpen();
		if ( onModalOpen ) {
			onModalOpen();
		}
	}, [ toggleOpen, onModalOpen ] );

	const handleModalClose = useCallback( () => {
		toggleOpen();
		if ( onModalClose ) {
			onModalClose();
		}
	}, [ toggleOpen, onModalClose ] );

	const callToActionProps = {
		onClick: handleCompleteTask,
		...callToAction,
	};
	return <TaskRow
		title={ title }
		duration={ duration }
		priority={ priority }
		isCompleted={ isCompleted }
		onClick={ handleModalOpen }
		badge={ badge }
		className={ className }
	>
		<TaskModal
			isOpen={ isOpen }
			onClose={ handleModalClose }
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
	</TaskRow>;
};
