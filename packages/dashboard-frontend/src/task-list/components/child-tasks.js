import { TasksProgressBar } from "./tasks-progressbar";
import { ArrowNarrowRightIcon, ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import { useCallback, useState, useMemo, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useSvgAria } from "@yoast/ui-library";
import { SingleTaskButton } from "./single-task-button";
import { isEmpty } from "lodash";

/**
 * @typedef {Object} Task
 * @property {string} title Title of the child task.
 * @property {number} duration Estimated duration to complete the child task.
 * @property {string} priority Priority of the child task: 'low', 'medium', 'high'.
 * @property {boolean} isCompleted Whether the child task is completed.
 * @property {string} id The ID of the child task.
 */

/**
 * The ChildTasks component to display progress of child tasks and a list of them.
 *
 * @param {Task[]} tasks The list of child tasks.
 * @param {function} singleTaskOnClick Callback function to handle click events on a child task.
 * @returns {JSX.Element} The ChildTasks component.
 */
export const ChildTasks = ( { tasks, singleTaskOnClick } ) => {
	const svgAriaProps = useSvgAria();
	const ITEMS_PER_PAGE = 4;
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const parentTaskId = isEmpty( tasks ) ? null : tasks[ 0 ]?.parentTaskId;

	useEffect( () => {
		setCurrentPage( 1 );
	}, [ parentTaskId ] );

	if ( isEmpty( tasks ) ) {
		return <div className="yst-italic yst-pt-6 yst-mt-6 yst-text-center yst-text-sm yst-text-slate-600 yst-border-t yst-border-t-slate-200">
			{ __( "No tasks detected", "wordpress-seo" ) }
		</div>;
	}

	const totalTasks = tasks?.length;
	const completedTasks = tasks.filter( ( task ) => task.isCompleted )?.length;

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
		<div>
			<TasksProgressBar
				label={ __( "Progress", "wordpress-seo" ) }
				completedTasks={ completedTasks }
				totalTasks={ totalTasks }
				size="small"
				className="yst-mb-4"
			/>
			{ currentPageTasks.map( ( task ) => (
				<SingleTaskButton
					key={ task.id }
					{ ...task }
					onClick={ singleTaskOnClick }
					className="yst-rounded-md yst-p-3 yst-pe-5 yst-border-b yst-border-slate-300 yst-shadow-sm yst-mb-3 last:yst-mb-0 yst-border hover:yst-bg-slate-50"
				/>
			) ) }
			{ totalPages > 1 && <div className="yst-flex yst-justify-between yst-items-center yst-mt-3">
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
						<ArrowNarrowLeftIcon className="yst-w-4 rtl:yst-rotate-180" { ...svgAriaProps } />
						{ __( "Previous", "wordpress-seo" ) }
						<span className="yst-sr-only">{ sprintf(
							/* translators: %d: current page number */
							__( "Child tasks, current page %d", "wordpress-seo" ), currentPage ) }</span>
					</Button>
					<Button
						variant="tertiary"
						className="yst-flex yst-gap-1.5"
						onClick={ handleNextPage }
						disabled={ isNextDisabled }
					>
						{ __( "Next", "wordpress-seo" ) }
						<ArrowNarrowRightIcon className="yst-w-4 rtl:yst-rotate-180" { ...svgAriaProps } />
						<span className="yst-sr-only">{ sprintf(
							/* translators: %d: current page number */
							__( "Child tasks, current page %d", "wordpress-seo" ), currentPage ) }</span>
					</Button>
				</div>
			</div> }
		</div>
	);
};
