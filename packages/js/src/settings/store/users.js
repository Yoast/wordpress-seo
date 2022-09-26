/* eslint-disable camelcase, complexity */
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { buildQueryString } from "@wordpress/url";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";

const usersAdapter = createEntityAdapter();

export const FETCH_USERS_ACTION_NAME = "fetchUsers";

/**
 * @param {Object} queryData The query data.
 * @returns {Object} Success or error action object.
 */
export function* fetchUsers( queryData ) {
	yield{ type: `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the fetch users control flow.
		const users = yield{
			type: FETCH_USERS_ACTION_NAME,
			payload: {
				context: "edit",
				...queryData,
			},
		};
		return { type: `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: users };
	} catch ( error ) {
		return { type: `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialUsersState = () => usersAdapter.getInitialState( {
	status: ASYNC_ACTION_STATUS.idle,
	error: "",
} );

const usersSlice = createSlice( {
	name: "users",
	initialState: createInitialUsersState(),
	reducers: {
		addOneUser: usersAdapter.addOne,
		addManyUsers: usersAdapter.addMany,
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			usersAdapter.addMany( state, action.payload );
		} );
		builder.addCase( `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		} );
	},
} );

// Prefix selectors
const userAdapterSelectors = usersAdapter.getSelectors( state => state.users );
export const usersSelectors = {
	selectUserIds: userAdapterSelectors.selectIds,
	selectUserById: userAdapterSelectors.selectById,
	selectUsers: userAdapterSelectors.selectEntities,
};

export const usersActions = {
	...usersSlice.actions,
	fetchUsers,
};

export const usersControls = {
	[ FETCH_USERS_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		path: `/wp/v2/users?${ buildQueryString( payload ) }`,
	} ),
};

export default usersSlice.reducer;
