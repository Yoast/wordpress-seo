import { TaskModal, ChildTasks } from "@yoast/dashboard-frontend";
import { useCallback, useMemo } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { isEmpty, values } from "lodash";

/**
 * The TaskListModal component to display the task details modal.
 *
 * @returns {JSX.Element} The TaskListModal component.
 */
export const TaskListModal = () => {
	const { setCurrentOpenTask, completeTask } = useDispatch( STORE_NAME );
	const { completeTaskEndpoint, nonce, currentOpenTask, tasks } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			completeTaskEndpoint: state.selectTasksEndpoints().completeTask,
			nonce: state.selectNonce(),
			currentOpenTask: state.selectCurrentOpenTask(),
			tasks: state.selectTasks(),
		};
	}, [] );
	const { status, errorMessage, parentTaskTitle } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			status: state.selectTaskStatus( currentOpenTask?.id ),
			errorMessage: state.selectTaskError( currentOpenTask?.id ),
			parentTaskTitle: state.selectTaskTitle( currentOpenTask?.parentTaskId ),
		};
	}, [ currentOpenTask ] );

	const parentChildTasks = values( tasks ).filter( task => currentOpenTask?.parentTaskId && task.parentTaskId === currentOpenTask?.parentTaskId );
	const childTasks = values( tasks ).filter( task => currentOpenTask?.id && task.parentTaskId === currentOpenTask?.id );

	const handleCompleteTask = useCallback( async() => {
		completeTask( currentOpenTask?.id, completeTaskEndpoint, nonce );
	}, [ currentOpenTask, completeTaskEndpoint, nonce ] );

	const handleOnClose = useCallback( () => {
		setCurrentOpenTask( null );
	}, [ setCurrentOpenTask ] );

	const totalTasks = useMemo( () => {
		if ( ! isEmpty( parentChildTasks ) ) {
			return parentChildTasks.length;
		}
		return childTasks.length;
	}, [ childTasks, parentChildTasks ] );

	const completedTasks = useMemo( () => {
		if ( ! isEmpty( parentChildTasks ) ) {
			return parentChildTasks.filter( ( task ) => task.isCompleted ).length;
		}
		return childTasks.filter( ( task ) => task.isCompleted ).length;
	}, [ childTasks, parentChildTasks ] );

	return currentOpenTask && <TaskModal
		isOpen={ ! isEmpty( currentOpenTask ) }
		onClose={ handleOnClose }
		{ ...currentOpenTask }
		taskId={ currentOpenTask?.id }
		callToAction={ {
			onClick: handleCompleteTask,
			...currentOpenTask?.callToAction,
		} }
		isLoading={ status === ASYNC_ACTION_STATUS.loading }
		isError={ status === ASYNC_ACTION_STATUS.error }
		errorMessage={ errorMessage }
		totalTasks={ totalTasks }
		completedTasks={ completedTasks }
		parentTaskTitle={ parentTaskTitle }
		onProgressBadgeClick={ setCurrentOpenTask }
	>
		{ ! isEmpty( childTasks ) && <ChildTasks tasks={ childTasks } singleTaskOnClick={ setCurrentOpenTask } /> }
	</TaskModal>;
};
