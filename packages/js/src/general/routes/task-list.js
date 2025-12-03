import { Paper, Title, Table } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { TaskRow, TasksProgressBar, GetTasksErrorRow } from "@yoast/dashboard-frontend";
import { values, isEmpty, size, sortBy } from "lodash";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { Task, TaskListUpsellRow } from "../components";

/**
 * The TaskList component to display the task list page content.
 *
 * @returns {JSX.Element} The TaskList component.
 */
export const TaskList = () => {
	const { setTasks } = useDispatch( STORE_NAME );
	const { getTasksEndpoint, isPremium, tasks, nonce } = useSelect( ( select ) => {
		const state = select( STORE_NAME );
		return {
			getTasksEndpoint: state.selectTasksEndpoints().getTasks,
			isPremium: state.getIsPremium(),
			tasks: state.selectTasks(),
			nonce: state.selectNonce(),
		};
	}, [] );
	const [ fetchState, setFetchState ] = useState( {
		error: null,
		isPending: false,
	} );
	const [ sortedTasks, setSortedTasks ] = useState( [] );

	useEffect( () => {
		const priorityOrder = { high: 1, medium: 2, low: 3 };
		const newSortedTasks = sortBy( values( tasks ), [
			( task ) => task.isCompleted,
			( task ) => priorityOrder[ task.priority ],
			( task ) => task.duration,
		] );
		setSortedTasks( newSortedTasks );
	}, [ tasks ] );

	const totalTasksCount = size( tasks );
	const completedTasksCount = size(
		values( tasks ).filter( task => task.isCompleted )
	);

	const fetchTasks = useCallback( async() => {
		try {
			setFetchState( { isPending: true, error: null } );
			const response = await fetch( getTasksEndpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": nonce,
				},
			} );
			const data = await response.json();
			if ( data.success !== true ) {
				throw new Error( data.error );
			}
			setTasks( data.tasks );
			setFetchState( { error: null, isPending: false } );
		} catch ( e ) {
			setFetchState( { error: e, isPending: false } );
		}
	}, [ getTasksEndpoint, nonce, setFetchState, setTasks ] );


	useEffect( () => {
		// Fetch tasks only if we don't have them yet.
		if ( isEmpty( tasks ) ) {
			fetchTasks();
		}
	}, [ tasks, fetchTasks ] );

	const { error, isPending } = fetchState;

	const placeholderTasks = [
		{ id: "task-1", title: "Complete the First-time configuration" },
		{ id: "task-2", title: "Remove the Hello World post" },
		{ id: "task-3", title: "Create an llms.txt file" },
		{ id: "task-4", title: "Set search appearance templates for your posts" },
		{ id: "task-5", title: "Set search appearance templates for your pages" },
	];

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
						{ isEmpty( tasks ) && isPending && placeholderTasks.map( task => <TaskRow.Loading key={ task.id } { ...task } /> ) }
						{ error && <GetTasksErrorRow message={ error } /> }
						{ ! isEmpty( sortedTasks ) && values( sortedTasks ).map( ( task ) => (
							<Task key={ task.id } { ...task } /> ) ) }
						{ ! isPremium && <TaskListUpsellRow /> }
					</Table.Body>
				</Table>
			</Paper.Content>
		</>
	</Paper>;
};
