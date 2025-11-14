import { CheckCircleIcon } from "@heroicons/react/solid";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { Table, useSvgAria, SkeletonLoader } from "@yoast/ui-library";
import { Priority } from "./priority";
import { Duration } from "./duration";
import { TaskBadge } from "./task-badge";
import { Ellipse } from "../../icons";
import { __ } from "@wordpress/i18n";

const badgeOptions = [ "premium", "woo", "ai" ];

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
				<ChevronRightIcon className="yst-w-4 yst-text-slate-600" { ...svgAriaProps } />
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
 * @param {string} badge An optional badge to display next to the task title: `premium`, `woo`, `ai`.
 * @param {boolean} [isCompleted] Whether the task is completed. If true, the call to action button will be disabled.
 * @param {Function} onClick Function to call when the row is clicked.
 * @param {boolean} [isLoading=false] Whether the title is loading.
 *
 * @returns {JSX.Element} The TaskRow component.
 */
export const TaskRow = ( { title, duration, priority, badge, isCompleted, onClick, isLoading } ) => {
	const svgAriaProps = useSvgAria();

	if ( isLoading ) {
		return <LoadingTaskRow title={ title } />;
	}

	return <Table.Row>
		<Table.Cell className="yst-font-medium yst-text-slate-800">
			<div className="yst-flex yst-items-center yst-gap-2">
				{ isCompleted
					? <CheckCircleIcon className="yst-w-4 yst-text-green-500" { ...svgAriaProps } />
					: <Ellipse className="yst-w-4 yst-text-slate-200" { ...svgAriaProps } /> }
				{ title }
				{ badgeOptions.includes( badge ) && <TaskBadge type={ badge } /> }
			</div>
		</Table.Cell>
		<Table.Cell>
			<Duration minutes={ duration } />
		</Table.Cell>
		<Table.Cell>
			<Priority level={ priority } />
		</Table.Cell>
		<Table.Cell className="yst-align-middle">
			<div className="yst-flex yst-items-center yst-justify-around yst-gap-2">
				<button onClick={ onClick } aria-label={ __( "Open task modal", "wordpress-seo" ) }>
					<ChevronRightIcon className="yst-w-4 yst-text-slate-800" { ...svgAriaProps } />
				</button>
			</div>
		</Table.Cell>
	</Table.Row>;
};
