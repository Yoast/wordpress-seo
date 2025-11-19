import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const TASK_LIST_NAME = "taskList";

const slice = createSlice( {
	name: TASK_LIST_NAME,
	initialState: { enabled: false },
	reducers: {},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialTaskListState = slice.getInitialState;


export const taskListSelectors = {
	selectIsTaskListEnabled: ( state ) => get( state, [ TASK_LIST_NAME, "enabled" ], false ),
};

export const taskListActions = {
	...slice.actions,
};

export const taskListReducer = slice.reducer;
