/* eslint-disable complexity */
import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { buildQueryString } from "@wordpress/url";
import { map, trim } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

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
			payload: { ...queryData },
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

/**
 * @param {Object} user The user.
 * @returns {Object} The prepared and predictable user.
 */
const prepareUser = user => ( {
	id: user?.id,
	// Fallbacks for user name, because we always need something to show.
	name: trim( user?.name ) || user?.slug || user?.id,
	slug: user?.slug,
} );

const usersSlice = createSlice( {
	name: "users",
	initialState: createInitialUsersState(),
	reducers: {
		addOneUser: {
			reducer: usersAdapter.addOne,
			prepare: user => ( { payload: prepareUser( user ) } ),
		},
		addManyUsers: {
			reducer: usersAdapter.addMany,
			prepare: users => ( { payload: map( users, prepareUser ) } ),
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ FETCH_USERS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			usersAdapter.addMany( state, map( action.payload, prepareUser ) );
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
usersSelectors.selectUsersWith = createSelector(
	[
		usersSelectors.selectUsers,
		( state, additionalUser = {} ) => additionalUser,
	],
	( users, additionalUser ) => {
		// Valid ID and not already existing?
		if ( additionalUser?.id && ! users[ additionalUser.id ] ) {
			// Add the additional user.
			return { ...users, [ additionalUser.id ]: { ...additionalUser } };
		}
		return users;
	}
);

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
