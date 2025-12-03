import { taskListSelectors } from "../../src/store";

describe( "taskListSelectors", () => {
	describe( "selectTasksEndpoints", () => {
		it( "should return an empty object when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectTasksEndpoints( state ) ).toEqual( {} );
		} );

		it( "should return an empty object when endpoints property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectTasksEndpoints( state ) ).toEqual( {} );
		} );

		it( "should return the endpoints object when present", () => {
			const endpoints = { complete: "/api/complete", fetch: "/api/fetch" };
			const state = { taskList: { endpoints } };
			expect( taskListSelectors.selectTasksEndpoints( state ) ).toEqual( endpoints );
		} );
	} );

	describe( "selectNonce", () => {
		it( "should return an empty string when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectNonce( state ) ).toBe( "" );
		} );

		it( "should return an empty string when nonce property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectNonce( state ) ).toBe( "" );
		} );

		it( "should return the nonce when present", () => {
			const nonce = "123abc";
			const state = { taskList: { nonce } };
			expect( taskListSelectors.selectNonce( state ) ).toBe( nonce );
		} );
	} );
	describe( "selectIsTaskListEnabled", () => {
		it.each( [
			{
				description: "should return false when task list is disabled",
				state: {
					taskList: {
						enabled: false,
					},
				},
				expected: false,
			},
			{
				description: "should return true when task list is enabled",
				state: {
					taskList: {
						enabled: true,
					},
				},
				expected: true,
			},
			{
				description: "should return false when task list state is undefined",
				state: {
					taskList: {},
				},
				expected: false,
			},
			{
				description: "should return false when task list slice is missing",
				state: {},
				expected: false,
			},
		] )( "$description", ( { state, expected } ) => {
			const result = taskListSelectors.selectIsTaskListEnabled( state );
			expect( result ).toBe( expected );
		} );
	} );
	describe( "selectTasks", () => {
		it.each( [
			{
				description: "should return an empty object when task list slice is missing",
				state: {},
				expected: {},
			},
			{
				description: "should return an empty object when tasks property is missing",
				state: { taskList: {} },
				expected: {},
			},
			{
				description: "should return the tasks object when tasks are present",
				state: {
					taskList: {
						tasks: {
							task1: { id: "task1", title: "Task 1" },
							task2: { id: "task2", title: "Task 2" },
						},
					},
				},
				expected: {
					task1: { id: "task1", title: "Task 1" },
					task2: { id: "task2", title: "Task 2" },
				},
			},
			{
				description: "should return an empty object when tasks is an empty object",
				state: {
					taskList: {
						tasks: {},
					},
				},
				expected: {},
			},
		] )( "$description", ( { state, expected } ) => {
			const result = taskListSelectors.selectTasks( state );
			expect( result ).toEqual( expected );
		} );
	} );

	describe( "selectTaskStatus", () => {
		const idle = "idle";
		const loading = "loading";
		const success = "success";
		const error = "error";

		it( "should return 'idle' when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectTaskStatus( state, "task1" ) ).toBe( idle );
		} );

		it( "should return 'idle' when tasks property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectTaskStatus( state, "task1" ) ).toBe( idle );
		} );

		it( "should return 'idle' when task is missing in tasks object", () => {
			const state = { taskList: { tasks: {} } };
			expect( taskListSelectors.selectTaskStatus( state, "task1" ) ).toBe( idle );
		} );

		it( "should return the status of the task if present", () => {
			const state = {
				taskList: {
					tasks: {
						task1: { id: "task1", status: loading },
						task2: { id: "task2", status: success },
					},
				},
			};
			expect( taskListSelectors.selectTaskStatus( state, "task1" ) ).toBe( loading );
			expect( taskListSelectors.selectTaskStatus( state, "task2" ) ).toBe( success );
		} );

		it( "should return 'idle' if status property is missing for the task", () => {
			const state = {
				taskList: {
					tasks: {
						task1: { id: "task1" },
					},
				},
			};
			expect( taskListSelectors.selectTaskStatus( state, "task1" ) ).toBe( idle );
		} );

		it( "should return custom status if present (e.g. error)", () => {
			const state = {
				taskList: {
					tasks: {
						task1: { id: "task1", status: error },
					},
				},
			};
			expect( taskListSelectors.selectTaskStatus( state, "task1" ) ).toBe( error );
		} );
	} );
	describe( "selectTaskError", () => {
		it( "should return null when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectTaskError( state, "task1" ) ).toBe( null );
		} );

		it( "should return null when tasks property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectTaskError( state, "task1" ) ).toBe( null );
		} );

		it( "should return null when task is missing in tasks object", () => {
			const state = { taskList: { tasks: {} } };
			expect( taskListSelectors.selectTaskError( state, "task1" ) ).toBe( null );
		} );

		it( "should return the error message of the task if present", () => {
			const state = {
				taskList: {
					tasks: {
						task1: { id: "task1", error: "Error occurred" },
						task2: { id: "task2", error: "Another error" },
					},
				},
			};
			expect( taskListSelectors.selectTaskError( state, "task1" ) ).toBe( "Error occurred" );
			expect( taskListSelectors.selectTaskError( state, "task2" ) ).toBe( "Another error" );
		} );
	} );
	describe( "selectIsTaskCompleted", () => {
		it( "should return null when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectIsTaskCompleted( state, "task1" ) ).toBeNull();
		} );

		it( "should return null when tasks property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectIsTaskCompleted( state, "task1" ) ).toBeNull();
		} );

		it( "should return null when task is missing in tasks object", () => {
			const state = { taskList: { tasks: {} } };
			expect( taskListSelectors.selectIsTaskCompleted( state, "task1" ) ).toBeNull();
		} );

		it( "should return the isCompleted status of the task if present", () => {
			const state = {
				taskList: {
					tasks: {
						task1: { id: "task1", isCompleted: true },
						task2: { id: "task2", isCompleted: false },
					},
				},
			};
			expect( taskListSelectors.selectIsTaskCompleted( state, "task1" ) ).toBe( true );
			expect( taskListSelectors.selectIsTaskCompleted( state, "task2" ) ).toBe( false );
		} );
	} );
	describe( "selectTasksStatus", () => {
		it( "should return 'idle' when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectTasksStatus( state ) ).toBe( "idle" );
		} );

		it( "should return 'idle' when status property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectTasksStatus( state ) ).toBe( "idle" );
		} );

		it( "should return the tasks status when present", () => {
			const state = { taskList: { status: "loading" } };
			expect( taskListSelectors.selectTasksStatus( state ) ).toBe( "loading" );
		} );
	} );
	describe( "selectTasksError", () => {
		it( "should return null when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectTasksError( state ) ).toBe( null );
		} );

		it( "should return null when error property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectTasksError( state ) ).toBe( null );
		} );

		it( "should return the tasks error when present", () => {
			const state = { taskList: { error: "Failed to fetch tasks" } };
			expect( taskListSelectors.selectTasksError( state ) ).toBe( "Failed to fetch tasks" );
		} );
	} );
	describe( "selectTotalTasksCount", () => {
		it( "should return 0 when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectTotalTasksCount( state ) ).toBe( 0 );
		} );

		it( "should return 0 when tasks property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectTotalTasksCount( state ) ).toBe( 0 );
		} );

		it( "should return the total number of tasks when present", () => {
			const state = {
				taskList: {
					tasks: {
						task1: { id: "task1" },
						task2: { id: "task2" },
						task3: { id: "task3" },
					},
				},
			};
			expect( taskListSelectors.selectTotalTasksCount( state ) ).toBe( 3 );
		} );
	} );
	describe( "selectCompletedTasksCount", () => {
		it( "should return 0 when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectCompletedTasksCount( state ) ).toBe( 0 );
		} );

		it( "should return 0 when tasks property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectCompletedTasksCount( state ) ).toBe( 0 );
		} );

		it( "should return the number of completed tasks", () => {
			const state = {
				taskList: {
					tasks: {
						task1: { id: "task1", isCompleted: true },
						task2: { id: "task2", isCompleted: false },
						task3: { id: "task3", isCompleted: true },
					},
				},
			};
			expect( taskListSelectors.selectCompletedTasksCount( state ) ).toBe( 2 );
		} );
	} );
	describe( "selectSortedTasks", () => {
		it( "should return an empty array when task list slice is missing", () => {
			const state = {};
			expect( taskListSelectors.selectSortedTasks( state ) ).toEqual( {} );
		} );

		it( "should return an empty array when tasks property is missing", () => {
			const state = { taskList: {} };
			expect( taskListSelectors.selectSortedTasks( state ) ).toEqual( {} );
		} );

		it( "should return sorted tasks based on completion, priority, duration, and title", () => {
			const state = {
				taskList: {
					tasks: {
						task2: { id: "task2", isCompleted: true, priority: "medium", duration: 5, title: "A Task" },
						task1: { id: "task1", isCompleted: false, priority: "high", duration: 10, title: "B Task" },
						task4: { id: "task4", isCompleted: false, priority: "high", duration: 3, title: "D Task" },
						task3: { id: "task3", isCompleted: true, priority: "low", duration: 8, title: "C Task" },
						task5: { id: "task5", isCompleted: false, priority: "high", duration: 3, title: "E Task" },
						task6: { id: "task6", isCompleted: true, priority: "low", duration: 5, title: "F Task" },
					},
				},
			};
			expect( taskListSelectors.selectSortedTasks( state ) ).toEqual( {
				task4: { id: "task4", isCompleted: false, priority: "high", duration: 3, title: "D Task" },
				task5: { id: "task5", isCompleted: false, priority: "high", duration: 3, title: "E Task" },
				task1: { id: "task1", isCompleted: false, priority: "high", duration: 10, title: "B Task" },
				task2: { id: "task2", isCompleted: true, priority: "medium", duration: 5, title: "A Task" },
				task6: { id: "task6", isCompleted: true, priority: "low", duration: 5, title: "F Task" },
				task3: { id: "task3", isCompleted: true, priority: "low", duration: 8, title: "C Task" },
			} );
		} );
	} );
} );
