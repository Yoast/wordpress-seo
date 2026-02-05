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
export const Task = ( { title, id, duration, priority, isCompleted, badge } ) => {
	const { resetTaskError, setCurrentOpenTask } = useDispatch( STORE_NAME );

	const childTasks = useSelect( ( select ) => select( STORE_NAME ).selectChildTasks( id ), [] );

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
	/>;
};
