import { TaskModal, ChildTasks } from "@yoast/dashboard-frontend";
import { useCallback } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { isEmpty } from "lodash";

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
	const { status, childTasks, errorMessage } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			childTasks: state.selectChildTasks( currentOpenTask?.id ),
			status: state.selectTaskStatus( currentOpenTask?.id ),
			errorMessage: state.selectTaskError( currentOpenTask?.id ),
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
	>
		{ ! isEmpty( childTasks ) && <ChildTasks
			taskId={ currentOpenTask?.id }
			tasks={ childTasks }
			parentTaskTitle={ currentOpenTask?.title }
			singleTaskOnClick={ handleSingleTaskOnClick }
		/> }
	</TaskModal>;
};
