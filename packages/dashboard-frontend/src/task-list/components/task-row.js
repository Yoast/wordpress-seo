import { ChevronRightIcon } from "@heroicons/react/outline";
import { Table, useSvgAria, SkeletonLoader, useToggleState } from "@yoast/ui-library";
import { Priority } from "./priority";
import { Duration } from "./duration";
import { TaskBadge } from "./task-badge";
import { TasksProgressBadge } from "./tasks-progress-badge";
import { TaskStatusIcon } from "../../icons";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { useMemo } from "react";

const badgeOptions = [ "premium", "woo", "ai" ];

/**
 * The LoadingTaskRow component to display a loading state for a task row.
 *
 * @param {string} titleClassName The class names of the task title skeleton.
 * @returns {JSX.Element} The LoadingTaskRow component.
 */
const LoadingTaskRow = ( { titleClassName } ) => {
	const svgAriaProps = useSvgAria();
	return <Table.Row>
		<Table.Cell className="yst-font-medium yst-text-slate-800">
			<div className="yst-flex yst-items-center yst-gap-2">
				<TaskStatusIcon isLoading={ true } />
				<SkeletonLoader className={ classNames( "yst-h-[18px]", titleClassName ) } />
			</div>
		</Table.Cell>
		<Table.Cell>
			<Duration isLoading={ true } />
		</Table.Cell>
		<Table.Cell>
			<Priority isLoading={ true } />
		</Table.Cell>
		<Table.Cell>
			<div className="yst-flex yst-justify-between">
				<TasksProgressBadge isLoading={ true } />
				<ChevronRightIcon
					className="yst-w-4 yst-text-slate-600 rtl:yst-rotate-180"
					{ ...svgAriaProps }
				/>
			</div>
		</Table.Cell>
	</Table.Row>;
};

/**
 * The TaskRow component to display a task in a table row.
 *
 * @param {string} title Title of the task.
 * @param {number} duration Estimated duration to complete the task.
 * @param {string} priority Priority of the task: 'low', 'medium', 'high'.
 * @param {string} [badge] An optional badge to display next to the task title: `premium`, `woo`, `ai`.
 * @param {boolean} isCompleted Whether the task is completed.
 * @param {Function} onClick Function to call when the row is clicked.
 * @param {string} [locale] Optional locale to use for formatting (defaults to browser locale)
 * @param {number} [completedTasks] Number of completed child tasks.
 * @param {number} [totalTasks] Total number of child tasks.
 *
 * @returns {JSX.Element} The TaskRow component.
 */
export const TaskRow = ( { title, duration, priority, badge, isCompleted, onClick, completedTasks, totalTasks, locale } ) => {
	const svgAriaProps = useSvgAria();
	const [ isButtonFocused, , ,handleButtonFocus, handleButtonBlur ] = useToggleState( false );

	const cellBackground = useMemo( () => isButtonFocused ? "yst-bg-slate-50" : "group-hover:yst-bg-slate-50", [ isButtonFocused ] );

	return (
		<Table.Row className="yst-cursor-pointer yst-group" onClick={ onClick } aria-label={ __( "Open task modal", "wordpress-seo" ) }>
			<Table.Cell className={ cellBackground }>
				<div className="yst-flex yst-items-center yst-gap-2">
					<TaskStatusIcon isCompleted={ isCompleted } />
					<button
						aria-haspopup="dialog"
						type="button"
						className={ classNames(
							"yst-font-medium focus:yst-outline-none focus-visible:yst-outline-none yst-text-start yst-relative yst-leading-5",
							"after:yst-content-[''] after:yst-absolute after:yst-left-0 after:yst-bottom-0 after:yst-h-[1px] after:yst-w-full after:yst-transition-opacity after:yst-duration-300 after:yst-ease-in-out",
							isCompleted ? "yst-text-slate-500 after:yst-bg-slate-500" : "yst-text-slate-800 hover:yst-text-slate-900 after:yst-bg-slate-800 hover:after:yst-bg-slate-900",
							isButtonFocused ? "after:yst-opacity-100" : "after:yst-opacity-0 group-hover:after:yst-opacity-100"
						) }
						onFocus={ handleButtonFocus }
						onBlur={ handleButtonBlur }
					>
						{ title }
						<span className="yst-sr-only">
							{ isCompleted ? __( "(Completed)", "wordpress-seo" ) : __( "(Not completed)", "wordpress-seo" ) }
						</span>
					</button>
					{ badgeOptions.includes( badge ) && <TaskBadge type={ badge } /> }
				</div>
			</Table.Cell>
			<Table.Cell className={ cellBackground }>
				<Priority level={ priority } isCompleted={ isCompleted } />
			</Table.Cell>
			<Table.Cell
				className={ classNames( cellBackground,
					isCompleted ? "yst-opacity-50" : "" ) }
			>
				<Duration minutes={ duration } locale={ locale } isCompleted={ isCompleted } />
			</Table.Cell>
			<Table.Cell
				className={ classNames( "yst-pe-5",
					cellBackground ) }
			>
				<div className="yst-flex yst-justify-between">
					{ totalTasks > 0 && <TasksProgressBadge completedTasks={ completedTasks } totalTasks={ totalTasks } /> }
					<ChevronRightIcon
						className={ classNames( "yst-w-4 yst-text-slate-600 rtl:yst-rotate-180 yst-transition yst-duration-300 yst-ease-in-out yst-shrink-0 yst-ms-auto",
							isButtonFocused ? "yst-text-slate-800 yst-translate-x-2" : "group-hover:yst-text-slate-800 group-hover:yst-translate-x-2"
						) } { ...svgAriaProps }
					/>
				</div>
			</Table.Cell>
		</Table.Row>
	);
};

TaskRow.Loading = LoadingTaskRow;
