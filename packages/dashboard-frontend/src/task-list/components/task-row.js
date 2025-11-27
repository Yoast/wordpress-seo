/* eslint-disable no-unused-vars */
import { CheckCircleIcon } from "@heroicons/react/solid";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { Table, useSvgAria, SkeletonLoader, useToggleState } from "@yoast/ui-library";
import { Priority } from "./priority";
import { Duration } from "./duration";
import { TaskBadge } from "./task-badge";
import { Ellipse } from "../../icons";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { useMemo } from "react";

const badgeOptions = [ "premium", "woo", "ai" ];

/**
 * The LoadingTaskRow component to display a loading state for a task row.
 *
 * @param {string} title Title of the task or a placeholder title.
 * @returns {JSX.Element} The LoadingTaskRow component.
 */
const LoadingTaskRow = ( { title } ) => {
	const svgAriaProps = useSvgAria();
	return <Table.Row>
		<Table.Cell className="yst-font-medium yst-text-slate-800">
			<div className="yst-flex yst-items-center yst-gap-2">
				<Ellipse className="yst-w-4 yst-text-slate-200" { ...svgAriaProps } />
				<SkeletonLoader className="yst-h-[18px]">{ title }</SkeletonLoader>
			</div>
		</Table.Cell>
		<Table.Cell>
			<Duration isLoading={ true } />
		</Table.Cell>
		<Table.Cell>
			<Priority isLoading={ true } />
		</Table.Cell>
		<Table.Cell className="yst-align-middle">
			<div className="yst-flex yst-items-center yst-justify-around yst-gap-2">
				<ChevronRightIcon className="yst-w-4 yst-text-slate-600 rtl:yst-rotate-180" { ...svgAriaProps } />
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
 * @param {JSX.Element} [children] Optional children elements for the task modal.
 *
 * @returns {JSX.Element} The TaskRow component.
 */
export const TaskRow = ( { title, duration, priority, badge, isCompleted, onClick, children } ) => {
	const svgAriaProps = useSvgAria();
	const [ isButtonFocused, , ,handleButtonFocus, handleButtonBlur ] = useToggleState( false );

	const cellBackground = useMemo( () => isButtonFocused ? "yst-bg-slate-50" : "group-hover:yst-bg-slate-50", [ isButtonFocused ] );

	return (
		<Table.Row className="yst-cursor-pointer yst-group" onClick={ onClick } aria-label={ __( "Open task modal", "wordpress-seo" ) }>
			<Table.Cell className={ cellBackground }>
				<div className="yst-flex yst-items-center yst-gap-2">
					{ isCompleted
						? <CheckCircleIcon className="yst-w-4 yst-text-green-500" { ...svgAriaProps } />
						: <Ellipse className="yst-w-4 yst-text-slate-200" { ...svgAriaProps } /> }
					<button
						aria-haspopup="dialog"
						type="button"
						className={ classNames(
							"yst-font-medium focus:yst-outline-none focus-visible:yst-outline-none",
							isCompleted ? "yst-text-slate-500" : "yst-text-slate-800 hover:yst-text-slate-900",
							isButtonFocused ? "yst-underline" : "group-hover:yst-underline"
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
			<Table.Cell
				className={ classNames( cellBackground,
					isCompleted ? "yst-opacity-50" : "" ) }
			>
				<Duration minutes={ duration } />
			</Table.Cell>
			<Table.Cell
				className={ classNames( "yst-pe-5",
					cellBackground ) }
			>
				<div className="yst-flex yst-justify-between">
					<Priority level={ priority } className={ isCompleted ? "yst-opacity-50" : "" } />
					<ChevronRightIcon
						className={ classNames( "yst-w-4 yst-text-slate-600 rtl:yst-rotate-180 yst-transition yst-duration-300 yst-ease-in-out",
							isButtonFocused ? "yst-text-slate-800 yst-translate-x-2" : "group-hover:yst-text-slate-800 group-hover:yst-translate-x-2"
						) } { ...svgAriaProps }
					/>
				</div>
				{ children }
			</Table.Cell>
		</Table.Row>
	);
};

TaskRow.Loading = LoadingTaskRow;
