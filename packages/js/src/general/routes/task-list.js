import { Paper, Title, Table } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { fetchJson, TaskRow, TasksProgressBar } from "@yoast/dashboard-frontend";
import { values, isEmpty, size, sortBy } from "lodash";
import { useEffect, useState, useRef, useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { Task, TaskListUpsellRow } from "../components";

/**
 * @returns {JSX.Element} The task list page content placeholder.
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
	const [ animatingTaskId, setAnimatingTaskId ] = useState( null );
	const [ pendingCompletedTask, setPendingCompletedTask ] = useState( null );
	const [ isAnyModalOpen, setIsAnyModalOpen ] = useState( false );
	const prevTasksRef = useRef( tasks );

	/*
	 Initial setup of sortedTasks.
	 These are the tasks that will be shown on the initial page load.
	 */
	useEffect( () => {
		if ( isEmpty( sortedTasks ) && ! isEmpty( tasks ) ) {
			const newSortedTasks = sortBy( values( tasks ), task => task.isCompleted ? 1 : 0 );
			setSortedTasks( newSortedTasks );
		}
	}, [ tasks, sortedTasks ] );

	// Main effect to handle task sorting and completion detection.
	useEffect( () => {
		const prevTasks = prevTasksRef.current;

		// Check for a newly completed task.
		const newlyCompletedTask = values( tasks ).find( task =>
			task.isCompleted && prevTasks[ task.id ] && ! prevTasks[ task.id ].isCompleted
		);

		if ( newlyCompletedTask ) {
			// Set the animation state and store the pending completed task.
			setAnimatingTaskId( newlyCompletedTask.id );
			setPendingCompletedTask( newlyCompletedTask );

			// Update current sortedTasks with a new completion status but keep positions.
			setSortedTasks( currentSortedTasks =>
				currentSortedTasks.map( task =>
					task.id === newlyCompletedTask.id ? { ...task, isCompleted: true } : task
				)
			);
		} else if ( ! pendingCompletedTask ) {
			// Only resort if there's no pending completed task.
			const newSortedTasks = sortBy( values( tasks ), task => task.isCompleted ? 1 : 0 );
			setSortedTasks( newSortedTasks );
		} else if ( pendingCompletedTask ) {
			// Update task data while preserving order when we have a pending completed task.
			setSortedTasks( currentSortedTasks =>
				currentSortedTasks.map( task => {
					const updatedTask = tasks[ task.id ];
					return updatedTask || task;
				} )
			);
		}

		prevTasksRef.current = tasks;
	}, [ tasks, pendingCompletedTask ] );

	// Handle moving a completed task to bottom when modal closes.
	useEffect( () => {
		if ( pendingCompletedTask && ! isAnyModalOpen ) {
			// Move the task to the bottom after the modal closes.
			setTimeout( () => {
				const otherTasks = values( tasks ).filter( task => task.id !== pendingCompletedTask.id );
				const newSortedTasks = sortBy( otherTasks, task => task.isCompleted ? 1 : 0 );
				newSortedTasks.push( pendingCompletedTask );
				setSortedTasks( newSortedTasks );

				// Clear animation and pending state after a short delay.
				setTimeout( () => {
					setAnimatingTaskId( null );
					setPendingCompletedTask( null );
				}, 300 );
			}, 500 );
		}
	}, [ pendingCompletedTask, isAnyModalOpen, tasks ] );

	const handleModalOpen = useCallback( () => {
		setIsAnyModalOpen( true );
	}, [] );

	const handleModalClose = useCallback( () => {
		setIsAnyModalOpen( false );
	}, [] );

	const totalTasksCount = size( tasks );
	const completedTasksCount = size(
		values( tasks ).filter( task => task.isCompleted )
	);

	useEffect( () => {
		// Fetch tasks only if we don't have them yet.
		if ( isEmpty( tasks ) ) {
			setFetchState( prev => ( { ...prev, isPending: true } ) );
			fetchJson( getTasksEndpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": nonce,
				},
			} )
				.then( ( response ) => {
					setFetchState( { error: null, isPending: false } );
					setTasks( response.tasks );
				} )
				.catch( ( e ) => {
					setFetchState( { error: e, isPending: false } );
				} );
		}
		// Only run on mount and when tasks changes.
	}, [ tasks, setTasks ] );

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
							<Table.Header className="yst-w-36">{ __( "Est. duration", "wordpress-seo" ) }</Table.Header>
							<Table.Header>{ __( "Priority", "wordpress-seo" ) }</Table.Header>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{ isEmpty( tasks ) && isPending && placeholderTasks.map( task => <TaskRow.Loading key={ task.id } { ...task } /> ) }
						{ error && <Table.Row><Table.Cell colSpan={ 4 }>{ __( "Error loading tasks", "wordpress-seo" ) }</Table.Cell></Table.Row> }
						{ ! isEmpty( sortedTasks ) && sortedTasks.map( ( task ) => {
							const isAnimating = animatingTaskId === task.id;
							const animationClasses = `
								yst-transition-all yst-duration-500 yst-ease-in-out
								${ isAnimating ? "yst-animate-pulse yst-bg-blue-50" : "" }
							`;
							return (
								<Task
									key={ task.id }
									{ ...task }
									className={ animationClasses }
									onModalOpen={ handleModalOpen }
									onModalClose={ handleModalClose }
								/>
							);
						} ) }
						{ ! isPremium && <TaskListUpsellRow /> }
					</Table.Body>
				</Table>
			</Paper.Content>
		</>
	</Paper>;
};
