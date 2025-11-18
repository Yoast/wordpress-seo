import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";
import { fetchJson } from "../fetch/fetch-json";

export const TASK_LIST_NAME = "taskList";
const COMPLETE_TASK = "completeTask";

/**
 * Completes a task by its ID.
 *
 * @param {string} id The task ID.
 * @param {string} endpoint The API endpoint.
 * @param {string} nonce The WP nonce.
 *
 * @returns {Object} Success or error action object.
 */
function* completeTask( id, endpoint, nonce ) {
	yield{ type: `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		const response = yield{
			type: COMPLETE_TASK,
			payload: { id, nonce, endpoint },
		};

		if ( ! response.success ) {
			throw new Error( `Request failed: ${ response.error }` );
		}
		return { type: `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.success }`, payload: { id } };
	} catch ( error ) {
		return { type: `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.error }`, payload: { error } };
	}
}

const slice = createSlice( {
	name: TASK_LIST_NAME,
	initialState: {
		enabled: false,
		tasks: {},
		status: ASYNC_ACTION_STATUS.idle,
	},
	reducers: {
		setTasks( state, action ) {
			state.tasks = action.payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
			state.error = null;
		} );
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload: { id } } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			if ( state.tasks[ id ] ) {
				state.tasks[ id ].is_completed = true;
			}
		} );
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload: { error } } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = error;
		} );
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialTaskListState = slice.getInitialState;

export const taskListSelectors = {
	selectIsTaskListEnabled: ( state ) => get( state, [ TASK_LIST_NAME, "enabled" ], false ),
	getTasks: ( state ) => get( state, [ TASK_LIST_NAME, "tasks" ], {} ),
};

export const taskListActions = {
	...slice.actions,
	completeTask,
};

export const taskListControls = {
	[ COMPLETE_TASK ]: async( { payload } ) => {
		const params = new URLSearchParams( { "options[task]": payload.id } );
		const url = `${payload.endpoint}?${params.toString()}`;
		const response = await fetchJson( url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": payload.nonce,
			},
		} );
		return response;
	},
};

export const taskListReducer = slice.reducer;
