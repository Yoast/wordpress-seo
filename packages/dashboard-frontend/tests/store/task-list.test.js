import { taskListSelectors } from "../../src/store";

describe( "taskListSelectors", () => {
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
} );
