import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const TASK_LIST_NAME = "taskList";

const slice = createSlice( {
	name: TASK_LIST_NAME,
	initialState: {
		enabled: false,
		endpoints: {
			getTasks: "",
			completeTask: "",
		},
		tasks: {},
	},
	reducers: {
		setTaskCompleted( state, action ) {
			const { taskId } = action.payload;
			state.tasks[ taskId ].isCompleted = true;
		},
		setTasks( state, action ) {
			state.tasks = action.payload;
		},
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialTaskListState = slice.getInitialState;

export const taskListSelectors = {
	selectIsTaskListEnabled: ( state ) => get( state, [ TASK_LIST_NAME, "enabled" ], false ),
	selectTaskListEndpoints: ( state ) => get( state, [ TASK_LIST_NAME, "endpoints" ], {} ),
	getTasks: ( state ) => get( state, [ TASK_LIST_NAME, "tasks" ], {} ),
};

export const taskListActions = {
	...slice.actions,
};

export const taskListReducer = slice.reducer;
