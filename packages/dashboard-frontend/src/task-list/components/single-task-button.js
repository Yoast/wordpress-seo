import { Duration } from "./duration";
import { Priority } from "./priority";
import { TasksProgressBadge } from "./tasks-progress-badge";
import { TaskStatusIcon } from "../../icons";
import { ChevronRightIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { useCallback } from "@wordpress/element";

/**
 * The SingleTaskButton component to display a single child task.
 *
 * @param {string} id The ID of the child task.
 * @param {boolean} isCompleted Whether the child task is completed.
 * @param {string} title Title of the child task.
 * @param {number} duration Estimated duration to complete the child task.
 * @param {string} priority Priority of the child task: 'low', 'medium', 'high'.
 * @param {function} onClick Callback function to handle click events on the child task.
 * @param {string} className Additional class names for the component.
 * @param {number} [completedTasks] Number of completed child tasks.
 * @param {number} [totalTasks] Total number of child tasks.
 * @returns {JSX.Element} The SingleTaskButton component.
 */
export const SingleTaskButton = ( { id, isCompleted, title, duration, priority, onClick, className, completedTasks = 0, totalTasks = 0 } ) => {
	const handleOnClick = useCallback( () => {
		onClick( id );
	}, [ onClick, id ] );

	return <button
		aria-haspopup="dialog"
		type="button"
		className={ classNames(
			"yst-group yst-flex yst-gap-3 yst-justify-between yst-w-full",
			className
		) }
		onClick={ handleOnClick }
	>
		<TaskStatusIcon isCompleted={ isCompleted } />
		<span className="yst-flex-grow yst-text-start">
			<div
				className={ classNames(
					"yst-mb-2 yst-font-medium yst-relative yst-leading-5 yst-w-fit",
					"after:yst-content-[''] after:yst-absolute after:yst-left-0 after:yst-bottom-0 after:yst-h-[1px] after:yst-w-full after:yst-transition-opacity after:yst-duration-300 after:yst-ease-in-out after:yst-opacity-0 group-hover:after:yst-opacity-100",
					isCompleted ? "yst-text-slate-500 after:yst-bg-slate-500" : "yst-text-slate-800 group-hover:yst-text-slate-900 after:yst-bg-slate-800 group-hover:after:yst-bg-slate-900"
				) }
			>
				{ title }
			</div>
			<div className="yst-flex yst-gap-2">
				{ totalTasks > 0 && <>
					<TasksProgressBadge completedTasks={ completedTasks } totalTasks={ totalTasks } />
					<span aria-hidden="true">·</span>
				</> }
				<Priority level={ priority } isCompleted={ isCompleted } />
				<span aria-hidden="true">·</span> <Duration minutes={ duration } isCompleted={ isCompleted } />
			</div>
		</span>
		<ChevronRightIcon className="yst-transition yst-duration-300 yst-ease-in-out yst-w-4 yst-text-slate-600 rtl:yst-rotate-180 group-hover:yst-text-slate-800 group-hover:yst-translate-x-2 yst-shrink-0 yst-hidden sm:yst-block" />
	</button>;
};
