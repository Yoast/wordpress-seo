import { Button, Paper, Title, Table } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { fetchJson } from "@yoast/dashboard-frontend";
import { get, values, isEmpty } from "lodash";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * @returns {JSX.Element} The task list page content placeholder.
 */
export const TaskList = () => {
	const { setTasks, completeTask } = useDispatch( STORE_NAME );
	const tasks = useSelect( ( select ) => select( STORE_NAME ).getTasks(), [] );
	const [ fetchState, setFetchState ] = useState( {
		error: null,
		isPending: false,
	} );

	const nonce = get( window, "wpseoScriptData.dashboard.nonce", "" );

	const handleCompleteTask = useCallback( async( e ) => {
		// get the task id from the button value.
		const taskId = e.target.value;
		completeTask( taskId, "/wp-json/yoast/v1/complete_task", nonce );
	}, [ nonce ] );

	useEffect( () => {
		// Fetch tasks only if we don't have them yet.
		if ( isEmpty( tasks ) ) {
			setFetchState( prev => ( { ...prev, isPending: true } ) );
			fetchJson( "/wp-json/yoast/v1/get_tasks", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": nonce,
				},
			} )
				.then( ( response ) => {
					setFetchState( { error: null, isPending: false } );
					const fixedTasks = Object.entries( response.tasks ).reduce( ( acc, [ key, task ] ) => {
						acc[ key ] = {
							title: task.copy_set.title,
							how: task.copy_set.how,
							why: task.copy_set.why,
							duration: task.duration,
							priority: task.priority,
							isCompleted: task.is_completed,
							id: task.id,
						};
						return acc;
					}, {} );
					setTasks( fixedTasks );
				} )
				.catch( ( e ) => {
					setFetchState( { error: e, isPending: false } );
				} );
		}
		// Only run on mount and when tasks changes.
	}, [ tasks, setTasks ] );

	const { error, isPending } = fetchState;

	return <Paper className="yst-mb-6">
		<>
			<Paper.Header>
				<Title>{ __( "Task list", "wordpress-seo" ) }</Title>
				<p className="yst-max-w-screen-sm yst-mt-3 yst-text-tiny">
					{ __( "Stay on top of your SEO progress with this task list. Complete each task to ensure your site is optimized and aligned with best SEO practices.", "wordpress-seo" ) }
				</p>
			</Paper.Header>
			<Paper.Content>
				<Table className="yst-mt-6">
					<Table.Head>
						<Table.Row>
							<Table.Header>{ __( "Tasks", "wordpress-seo" ) }</Table.Header>
							<Table.Header>{ __( "Est. duration", "wordpress-seo" ) }</Table.Header>
							<Table.Header>{ __( "Priority", "wordpress-seo" ) }</Table.Header>
							<Table.Header>{ "" }</Table.Header>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{ isEmpty( tasks ) && isPending && <Table.Row><Table.Cell colSpan={ 4 }>{ __( "Loading…", "wordpress-seo" ) }</Table.Cell></Table.Row> }
						{ error && <Table.Row><Table.Cell colSpan={ 4 }>{ __( "Error loading tasks", "wordpress-seo" ) }</Table.Cell></Table.Row> }
						{ ! isEmpty( tasks ) && values( tasks ).map( ( task ) => (
							<Table.Row key={ task.id }>
								<Table.Cell>{ task.title }</Table.Cell>
								<Table.Cell>{ task.duration }</Table.Cell>
								<Table.Cell>{ task.priority }</Table.Cell>
								<Table.Cell>
									{ task.isCompleted ? __( "Completed", "wordpress-seo" ) : __( "Pending", "wordpress-seo" ) }
									<Button onClick={ handleCompleteTask } value={ task.id }>Complete</Button>
								</Table.Cell>
							</Table.Row>
						) ) }
					</Table.Body>
				</Table>
			</Paper.Content>
		</>
	</Paper>;
};
