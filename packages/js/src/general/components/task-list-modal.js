import { TaskModal, ChildTasks } from "@yoast/dashboard-frontend";
import { useCallback } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { isEmpty } from "lodash";
import { useMemo } from "react";

/**
 * The TaskListModal component to display the task details modal.
 *
 * @returns {JSX.Element} The TaskListModal component.
 */
export const TaskListModal = () => {
	const { setCurrentOpenTask, completeTask } = useDispatch( STORE_NAME );
	const { completeTaskEndpoint, nonce, currentOpenTask } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			completeTaskEndpoint: state.selectTasksEndpoints().completeTask,
			nonce: state.selectNonce(),
			currentOpenTask: state.selectCurrentOpenTask(),
		};
	}, [] );
	const { status, childTasks, errorMessage, parentTaskTitle, parentChildTasks } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			childTasks: state.selectChildTasks( currentOpenTask?.id ),
			status: state.selectTaskStatus( currentOpenTask?.id ),
			errorMessage: state.selectTaskError( currentOpenTask?.id ),
			parentTaskTitle: state.selectParentTaskTitle( currentOpenTask?.id ),
			parentChildTasks: state.selectChildTasks( currentOpenTask?.parentTaskId ),
		};
	}, [ currentOpenTask ] );

	const handleCompleteTask = useCallback( async() => {
		completeTask( currentOpenTask?.id, completeTaskEndpoint, nonce );
	}, [ currentOpenTask, completeTaskEndpoint, nonce ] );

	const handleOnClose = useCallback( () => {
		setCurrentOpenTask( null );
	}, [ setCurrentOpenTask ] );

	const handleSingleTaskOnClick = useCallback( ( taskId ) => {
		setCurrentOpenTask( taskId );
	}, [ setCurrentOpenTask ] );

	const totalTasks = useMemo( () => {
		if ( isEmpty( childTasks ) && isEmpty( parentChildTasks ) ) {
			return 0;
		}
		if ( ! isEmpty( parentChildTasks ) ) {
			return parentChildTasks.length;
		}
		return childTasks.length;
	}, [ childTasks, parentChildTasks ] );

	const completedTasks = useMemo( () => {
		if ( isEmpty( childTasks ) && isEmpty( parentChildTasks ) ) {
			return 0;
		}
		if ( ! isEmpty( parentChildTasks ) ) {
			return parentChildTasks.filter( ( task ) => task.isCompleted ).length;
		}
		return childTasks.filter( ( task ) => task.isCompleted ).length;
	}, [ childTasks, parentChildTasks ] );

	return <TaskModal
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
	>
		{ ! isEmpty( childTasks ) && <ChildTasks tasks={ childTasks } singleTaskOnClick={ handleSingleTaskOnClick } /> }
	</TaskModal>;
};
