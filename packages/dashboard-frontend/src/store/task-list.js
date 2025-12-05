import { createSlice } from "@reduxjs/toolkit";
import { get, keys, sortBy, values, size } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";

export const TASK_LIST_NAME = "taskList";
const COMPLETE_TASK = "completeTask";
const FETCH_TASK = "fetchTasks";

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
 * @property {string} status
 * @property {string|null} error
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
	status: ASYNC_ACTION_STATUS.idle,
	error: null,
};

/**
 * Sort tasks whenever they change.
 * Sorting order:
 * 1. Incomplete tasks first.
 * 2. Higher priority tasks first (high, medium, low).
  * 3. If tasks have the same completion status and priority, sort by duration (shorter duration first).
 * 4. If tasks have the same completion status, priority, and duration, sort alphabetically by title.
 *
 * @param {Object.<string, Task>} tasks The tasks to sort.
 *
 * @returns {Object.<string, Task>} The sorted tasks.
 */
function sortTasks( tasks ) {
	const priorityOrder = { high: 1, medium: 2, low: 3 };
	const sortedTasksArray = sortBy( values( tasks ), [
		( task ) => task.isCompleted,
		( task ) => priorityOrder[ task.priority ],
		( task ) => task.duration,
		( task ) => task.title.toLowerCase(),
	] );
	// Return an object with the same structure, but sorted.
	return sortedTasksArray.reduce( ( acc, task ) => {
		acc[ task.id ] = task;
		return acc;
	}, {} );
}

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
			throw new Error( response.error );
		}
		return { type: `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.success }`, payload: { id } };
	} catch ( error ) {
		return { type: `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.error }`, payload: { error, id } };
	}
}

/**
 * Fetches tasks from the given endpoint.
 *
 * @param {string} endpoint The get tasks endpoint.
 * @param {string} nonce The WP nonce.
 * @returns {Object} Success or error action object.
 */
function* fetchTasks( endpoint, nonce ) {
	yield{ type: `${ FETCH_TASK }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		const response = yield{
			type: FETCH_TASK,
			payload: { nonce, endpoint },
		};
		if ( response.success !== true ) {
			throw new Error( response.error );
		}
		return { type: `${ FETCH_TASK }/${ ASYNC_ACTION_NAMES.success }`, payload: { tasks: response.tasks } };
	} catch ( error ) {
		return { type: `${ FETCH_TASK }/${ ASYNC_ACTION_NAMES.error }`, payload: { error } };
	}
}

const slice = createSlice( {
	name: TASK_LIST_NAME,
	initialState,
	reducers: {
		setTasks( state, { payload } ) {
			keys( payload ).forEach( ( id ) => {
				payload[ id ].status = ASYNC_ACTION_STATUS.idle;
				payload[ id ].error = null;
				// eslint-disable-next-line no-inline-comments
				payload[ id ].badge = null; // Remove this when we want to re-instate badges.
			} );
			state.tasks = payload;
		},
		setTaskCompleted( state, { payload } ) {
			if ( state.tasks[ payload ] ) {
				state.tasks[ payload ].isCompleted = true;
			}
		},
		resetTaskError( state, { payload } ) {
			if ( state.tasks[ payload ] && state.tasks[ payload ].status === ASYNC_ACTION_STATUS.error ) {
				state.tasks[ payload ].error = null;
				state.tasks[ payload ].status = ASYNC_ACTION_STATUS.idle;
			}
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.request }`, ( state, { payload: { id } } ) => {
			state.tasks[ id ].status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload: { id } } ) => {
			state.tasks[ id ].status = ASYNC_ACTION_STATUS.success;
			state.tasks[ id ].error = null;
			state.tasks[ id ].isCompleted = true;
		} );
		builder.addCase( `${ COMPLETE_TASK }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload: { error, id } } ) => {
			state.tasks[ id ].status = ASYNC_ACTION_STATUS.error;
			state.tasks[ id ].error = error.message;
		} );
		builder.addCase( `${ FETCH_TASK }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload: { tasks } } ) => {
			slice.caseReducers.setTasks( state, { payload: sortTasks( tasks ) } );
			state.status = ASYNC_ACTION_STATUS.idle;
			state.error = null;
		} );
		builder.addCase( `${ FETCH_TASK }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
			state.error = null;
		} );
		builder.addCase( `${ FETCH_TASK }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload: { error } } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = error.message;
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
	selectTaskError: ( state, id ) => get( state, [ TASK_LIST_NAME, "tasks", id, "error" ], null ),
	selectTasksEndpoints: ( state ) => get( state, [ TASK_LIST_NAME, "endpoints" ], {} ),
	selectNonce: ( state ) => get( state, [ TASK_LIST_NAME, "nonce" ], "" ),
	selectIsTaskCompleted: ( state, id ) => get( state, [ TASK_LIST_NAME, "tasks", id, "isCompleted" ], null ),
	selectTasksStatus: ( state ) => get( state, [ TASK_LIST_NAME, "status" ], ASYNC_ACTION_STATUS.idle ),
	selectTasksError: ( state ) => get( state, [ TASK_LIST_NAME, "error" ], null ),
	selectSortedTasks: ( state ) => {
		const tasks = get( state, [ TASK_LIST_NAME, "tasks" ], {} );
		return sortTasks( tasks );
	},
	selectTotalTasksCount: ( state ) => {
		const tasks = get( state, [ TASK_LIST_NAME, "tasks" ], {} );
		return size( tasks );
	},
	selectCompletedTasksCount: ( state ) => {
		const tasks = get( state, [ TASK_LIST_NAME, "tasks" ], {} );
		return size(
			values( tasks ).filter( task => task.isCompleted )
		);
	},
};

export const taskListActions = {
	...slice.actions,
	completeTask,
	fetchTasks,
};

export const taskListControls = {
	[ COMPLETE_TASK ]: async( { payload } ) => {
		const params = new URLSearchParams( { "options[task]": payload.id } );
		const url = `${payload.endpoint}?${params.toString()}`;
		try {
			const response = await fetch( url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": payload.nonce,
				},
			} );
			return await response.json();
		} catch ( error ) {
			return error;
		}
	},
	[ FETCH_TASK ]: async( { payload } ) => {
		try {
			const response = await fetch( payload.endpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": payload.nonce,
				},
			} );
			return await response.json();
		} catch ( error ) {
			return error;
		}
	},
};

export const taskListReducer = slice.reducer;
