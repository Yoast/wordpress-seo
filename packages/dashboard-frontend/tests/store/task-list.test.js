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
} );
