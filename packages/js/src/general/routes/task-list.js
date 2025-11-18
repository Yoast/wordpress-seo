import { Paper, Title, Table } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { fetchJson } from "@yoast/dashboard-frontend";
import { get, values, isEmpty } from "lodash";
import { useEffect, useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { Task } from "../components/task";

/**
 * @returns {JSX.Element} The task list page content placeholder.
 */
export const TaskList = () => {
	const { setTasks } = useDispatch( STORE_NAME );
	const tasks = useSelect( ( select ) => select( STORE_NAME ).getTasks(), [] );
	const [ fetchState, setFetchState ] = useState( {
		error: null,
		isPending: false,
	} );

	const nonce = get( window, "wpseoScriptData.dashboard.nonce", "" );

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
							callToAction: task.call_to_action,
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
				<Table>
					<Table.Head>
						<Table.Row>
							<Table.Header>{ __( "Tasks", "wordpress-seo" ) }</Table.Header>
							<Table.Header className="yst-w-36">{ __( "Est. duration", "wordpress-seo" ) }</Table.Header>
							<Table.Header className="yst-w-24">{ __( "Priority", "wordpress-seo" ) }</Table.Header>
							<Table.Header className="yst-w-16">{ "" }</Table.Header>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{ isEmpty( tasks ) && isPending && <Table.Row><Table.Cell colSpan={ 4 }>{ __( "Loading…", "wordpress-seo" ) }</Table.Cell></Table.Row> }
						{ error && <Table.Row><Table.Cell colSpan={ 4 }>{ __( "Error loading tasks", "wordpress-seo" ) }</Table.Cell></Table.Row> }
						{ ! isEmpty( tasks ) && values( tasks ).map( ( task ) => (
							<Task key={ task.id } { ...task } /> ) ) }
					</Table.Body>
				</Table>
			</Paper.Content>
		</>
	</Paper>;
};
