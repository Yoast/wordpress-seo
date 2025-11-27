import { createSlice } from "@reduxjs/toolkit";
import { get, keys } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";
import { fetchJson } from "../fetch/fetch-json";

export const TASK_LIST_NAME = "taskList";
const COMPLETE_TASK = "completeTask";

/**
 * @typedef {Object} CallToAction
 * @property {string} label
 * @property {string} type
 * @property {string} [href]
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {boolean} isCompleted
 * @property {string} title
 * @property {number} duration
 * @property {string} priority
 * @property {string} why
 * @property {string} how
 * @property {string} status
 * @property {Object|null} error
 * @property {CallToAction} callToAction
 */

/**
 * @typedef {Object} Endpoints
 * @property {string} completeTask
 * @property {string} getTasks
 */

/**
 * @typedef {Object} TaskListState
 * @property {boolean} enabled
 * @property {Object.<string, Task>} tasks
 * @property {Endpoints} endpoints
 * @property {string} nonce
 */

/** @type {TaskListState} */
const initialState = {
	enabled: false,
	tasks: {},
	endpoints: {
		completeTask: "",
		getTasks: "",
	},
	nonce: "",
};

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
	yield{ type: `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.request }`, payload: { id } };
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
		return { type: `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.error }`, payload: { error, id } };
	}
}

const slice = createSlice( {
	name: TASK_LIST_NAME,
	initialState,
	reducers: {
		setTasks( state, action ) {
			keys( action.payload ).forEach( ( id ) => {
				action.payload[ id ].status = ASYNC_ACTION_STATUS.idle;
				action.payload[ id ].error = null;
				// eslint-disable-next-line no-inline-comments
				action.payload[ id ].badge = null; // Remove this when we want to re-instate badges.
			} );
			state.tasks = action.payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.request }`, ( state, { payload: { id } } ) => {
			state.tasks[ id ].status = ASYNC_ACTION_STATUS.loading;
			state.tasks[ id ].error = null;
		} );
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload: { id } } ) => {
			state.tasks[ id ].status = ASYNC_ACTION_STATUS.success;
			state.tasks[ id ].error = null;
			state.tasks[ id ].isCompleted = true;
		} );
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload: { error, id } } ) => {
			state.tasks[ id ].status = ASYNC_ACTION_STATUS.error;
			state.tasks[ id ].error = error;
		} );
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialTaskListState = slice.getInitialState;

export const taskListSelectors = {
	selectIsTaskListEnabled: ( state ) => get( state, [ TASK_LIST_NAME, "enabled" ], false ),
	selectTasks: ( state ) => get( state, [ TASK_LIST_NAME, "tasks" ], {} ),
	selectTaskStatus: ( state, id ) => get( state, [ TASK_LIST_NAME, "tasks", id, "status" ], ASYNC_ACTION_STATUS.idle ),
	selectTasksEndpoints: ( state ) => get( state, [ TASK_LIST_NAME, "endpoints" ], {} ),
	selectNonce: ( state ) => get( state, [ TASK_LIST_NAME, "nonce" ], "" ),
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
