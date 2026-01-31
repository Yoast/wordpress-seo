import { TasksProgressBar } from "./tasks-progressbar";
import { Duration } from "./duration";
import { Priority } from "./priority";
import { TaskStatusIcon } from "../../icons";
import { ChevronRightIcon, ArrowNarrowRightIcon, ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { useCallback, useState, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";

/**
 * @typedef {Object} Tasks
 * @property {string} title Title of the child task.
 * @property {number} duration Estimated duration to complete the child task.
 * @property {string} priority Priority of the child task: 'low', 'medium', 'high'.
 * @property {boolean} isCompleted Whether the child task is completed.
 * @property {string} taskId The ID of the child task.
 */

const SingleChildTask = ( { taskId, isCompleted, title, duration, priority, onClick } ) => {
	const handleOnClick = useCallback( () => {
		onClick( taskId );
	}, [ onClick, taskId ] );

	return <button
		aria-haspopup="dialog"
		type="button"
		className="yst-group yst-flex yst-gap-3 yst-rounded-md yst-justify-between yst-p-3 yst-pe-5 yst-border-b yst-border-slate-300 yst-shadow-sm yst-mt-3 yst-border yst-w-full hover:yst-bg-slate-50"
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
			<div className="yst-flex yst-gap-1">
				<Priority level={ priority }  isCompleted={ isCompleted } />
				· <Duration minutes={ duration } isCompleted={ isCompleted } />
			</div>
		</span>
		<ChevronRightIcon className="yst-transition yst-duration-300 yst-ease-in-out yst-w-4 yst-text-slate-600 rtl:yst-rotate-180 group-hover:yst-text-slate-800 group-hover:yst-translate-x-2" />
	</button>;
};

/**
 * The ChildTasks component to display progress of child tasks and a list of them.
 *
 * @param {Tasks[]} tasks The list of child tasks.
 * @param {function} onClick Callback function to handle click events on a child task.
 * @returns {JSX.Element} The ChildTasks component.
 */
export const ChildTasks = ( { tasks, onClick } ) => {
	const ITEMS_PER_PAGE = 4;
	const [ currentPage, setCurrentPage ] = useState( 1 );

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter( ( task ) => task.isCompleted ).length;

	// Calculate pagination values
	const totalPages = Math.ceil( totalTasks / ITEMS_PER_PAGE );
	const startIndex = ( currentPage - 1 ) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;

	// Get current page tasks
	const currentPageTasks = useMemo( () => {
		return tasks.slice( startIndex, endIndex );
	}, [ tasks, startIndex, endIndex ] );

	// Navigation handlers
	const handlePreviousPage = useCallback( () => {
		setCurrentPage( ( prev ) => Math.max( prev - 1, 1 ) );
	}, [] );

	const handleNextPage = useCallback( () => {
		setCurrentPage( ( prev ) => Math.min( prev + 1, totalPages ) );
	}, [ totalPages ] );

	const isPreviousDisabled = currentPage === 1;
	const isNextDisabled = currentPage === totalPages || totalPages === 0;

	return (
		<div className="yst-mt-6">
			<TasksProgressBar completedTasks={ completedTasks } totalTasks={ totalTasks } />
			{ currentPageTasks.map( ( task ) => (
				<SingleChildTask
					key={ task.taskId }
					{ ...task }
					onClick={ onClick }
				/>
			) ) }
			<div className="yst-flex yst-justify-between yst-items-center yst-mt-3">
				<div className="yst-text-slate-500 yst-text-xs">
					{ sprintf(
						/* translators: %1$d: current page number, %2$d: total number of pages */
						__( "Page %1$d out of %2$d", "wordpress-seo" ), currentPage, totalPages ) }
				</div>

				<div className="yst-flex yst-items-center">
					<Button
						variant="tertiary"
						className="yst-flex yst-gap-1.5"
						onClick={ handlePreviousPage }
						disabled={ isPreviousDisabled }
					>
						<ArrowNarrowLeftIcon className="yst-w-4" />
						{ __( "Previous", "wordpress-seo" ) }
					</Button>
					<Button
						variant="tertiary"
						className="yst-flex yst-gap-1.5"
						onClick={ handleNextPage }
						disabled={ isNextDisabled }
					>
						{ __( "Next", "wordpress-seo" ) }
						<ArrowNarrowRightIcon className="yst-w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
