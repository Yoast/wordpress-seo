import { Paper, Title, Table } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { TaskRow, TasksProgressBar, GetTasksErrorRow } from "@yoast/dashboard-frontend";
import { values, isEmpty } from "lodash";
import { useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { Task, TaskListUpsellRow } from "../components";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const loadingTasksTitleWidth = [
	"sm:yst-w-60",
	"sm:yst-w-72",
	"sm:yst-w-72",
	"sm:yst-w-80",
	"sm:yst-w-28",
	"sm:yst-w-40",
	"sm:yst-w-28",
	"sm:yst-w-32",
	"sm:yst-w-52",
	"sm:yst-w-60",
];

/**
 * The TaskList component to display the task list page content.
 *
 * @returns {JSX.Element} The TaskList component.
 */
export const TaskList = () => {
	const { fetchTasks } = useDispatch( STORE_NAME );
	const { getTasksEndpoint,
		isPremium,
		tasks,
		nonce,
		tasksStatus,
		tasksError,
		sortedTasks,
		totalTasksCount,
		completedTasksCount,
	} = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			getTasksEndpoint: state.selectTasksEndpoints().getTasks,
			isPremium: state.getIsPremium(),
			tasks: state.selectTasks(),
			nonce: state.selectNonce(),
			tasksStatus: state.selectTasksStatus(),
			tasksError: state.selectTasksError(),
			sortedTasks: state.selectSortedTasks(),
			totalTasksCount: state.selectTotalTasksCount(),
			completedTasksCount: state.selectCompletedTasksCount(),
		};
	}, [] );

	const isPending = tasksStatus === ASYNC_ACTION_STATUS.loading;

	useEffect( () => {
		// Fetch tasks only if we don't have them yet.
		if ( isEmpty( tasks ) ) {
			fetchTasks( getTasksEndpoint, nonce );
		}
	}, [ tasks, fetchTasks ] );

	return <Paper className="yst-mb-6">
		<>
			<Paper.Header>
				<Title>{ __( "Task list", "wordpress-seo" ) }</Title>
				<p className="yst-max-w-screen-sm yst-mt-3 yst-text-tiny">
					{ __( "Stay on top of your SEO progress with this task list. Complete each task to ensure your site is optimized and aligned with best SEO practices.", "wordpress-seo" ) }
				</p>
			</Paper.Header>
			<Paper.Content>
				<TasksProgressBar
					completedTasks={ completedTasksCount }
					totalTasks={ totalTasksCount }
					isLoading={ isPending }
				/>
				<Table className="yst-mt-4">
					<Table.Head>
						<Table.Row>
							<Table.Header>{ __( "Task", "wordpress-seo" ) }</Table.Header>
							<Table.Header className="yst-max-w-36">{ __( "Est. duration", "wordpress-seo" ) }</Table.Header>
							<Table.Header className="yst-max-w-44">{ __( "Priority", "wordpress-seo" ) }</Table.Header>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{ isEmpty( tasks ) && isPending && loadingTasksTitleWidth.map( ( width, index ) => <TaskRow.Loading key={ `${index}-loading-task` } titleClassName={ `yst-w-20 ${width}` } /> ) }
						{ tasksStatus === ASYNC_ACTION_STATUS.error && <GetTasksErrorRow message={ tasksError } /> }
						{ ! isEmpty( sortedTasks ) && values( sortedTasks ).map( ( task ) => (
							<Task key={ task.id } { ...task } /> ) ) }
						{ ! isPremium && <TaskListUpsellRow /> }
					</Table.Body>
				</Table>
			</Paper.Content>
		</>
	</Paper>;
};
