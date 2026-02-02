import { TaskRow } from "@yoast/dashboard-frontend";
import { useCallback } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * The Task component to display a task row and modal.
 *
 * @param {string} title The title of the task.
 * @param {string} id The ID of the task.
 * @param {number} duration The duration in minutes.
 * @param {string} priority The priority: 'low', 'medium', 'high'.
 * @param {boolean} isCompleted Whether the task is completed.
 * @param {number} completedTasks The number of completed child tasks.
 * @param {number} totalTasks The total number of child tasks.
 * @param {string} [badge] An optional badge to display next to the task title: `premium`, `woo`, `ai`.
 *
 * @returns {JSX.Element} The Task component.
 */
export const Task = ( { title, id, duration, priority, isCompleted, completedTasks, totalTasks, badge } ) => {
	const { resetTaskError, setCurrentOpenTask } = useDispatch( STORE_NAME );

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
	/>;
};
