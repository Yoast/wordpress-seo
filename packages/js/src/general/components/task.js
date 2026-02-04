import { TaskRow } from "@yoast/dashboard-frontend";
import { useCallback, useMemo } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * The Task component to display a task row and modal.
 *
 * @param {string} title The title of the task.
 * @param {string} id The ID of the task.
 * @param {number} duration The duration in minutes.
 * @param {string} priority The priority: 'low', 'medium', 'high'.
 * @param {boolean} isCompleted Whether the task is completed.
 * @param {string} [badge] An optional badge to display next to the task title: `premium`, `woo`, `ai`.
 *
 * @returns {JSX.Element} The Task component.
 */
export const Task = ( { title, id, how, why, duration, priority, isCompleted, callToAction, badge } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( false );
	const { completeTask, resetTaskError } = useDispatch( STORE_NAME );
	const { status, completeTaskEndpoint, nonce, errorMessage } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			status: state.selectTaskStatus( id ),
			errorMessage: state.selectTaskError( id ),
			completeTaskEndpoint: state.selectTasksEndpoints().completeTask,
			nonce: state.selectNonce(),
		};
	}, [] );

	const totalTasks = useMemo( () => {
		return childTasks.length;
	}, [ childTasks ] );

	const completedTasks = useMemo( () => {
		return childTasks.filter( ( task ) => task.isCompleted ).length;
	}, [ childTasks ] );

	const handleOnOpen = useCallback( () => {
		resetTaskError( id );
		setCurrentOpenTask( id );
	}, [ resetTaskError, setCurrentOpenTask, id ] );

	return <TaskRow
		title={ title }
		duration={ duration }
		priority={ priority }
		isCompleted={ isCompleted }
		onClick={ handleOnOpen }
		completedTasks={ completedTasks }
		totalTasks={ totalTasks }
		badge={ badge }
	>
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
			isError={ status === ASYNC_ACTION_STATUS.error }
			errorMessage={ errorMessage }
		/>
	</TaskRow>;
};
