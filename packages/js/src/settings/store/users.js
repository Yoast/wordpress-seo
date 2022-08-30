/* eslint-disable camelcase, complexity */
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";

const usersAdapter = createEntityAdapter();

export const FETCH_USERS_ACTION_NAME = "fetchUsers";

/**
 * @param {Object} [query] The query to run.
 * @returns {Object} Success or error action object.
 */
export function* fetchUsers( query = {} ) {
	yield{ type: `${FETCH_USERS_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}` };
	try {
		// Trigger the fetch media control flow.
		const media = yield{
			type: FETCH_USERS_ACTION_NAME,
			payload: { data: query },
		};
		return { type: `${FETCH_USERS_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`, payload: media };
	} catch ( error ) {
		return { type: `${FETCH_USERS_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`, payload: error };
	}
}

const usersSlice = createSlice( {
	name: "users",
	initialState: usersAdapter.getInitialState( {
		status: "idle",
		error: "",
	} ),
	reducers: {
		addOneMedia: usersAdapter.addOne,
		addManyMedia: usersAdapter.addMany,
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${FETCH_USERS_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${FETCH_USERS_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			usersAdapter.addMany( state, action.payload );
		} );
		builder.addCase( `${FETCH_USERS_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		} );
	  },
} );

// Prefix selectors
const adapterSelectors = usersAdapter.getSelectors( state => state.media );
export const mediaSelectors = {
	selectUserIds: adapterSelectors.selectIds,
	selectUsersById: adapterSelectors.selectById,
};

export const usersActions = {
	...usersSlice.actions,
	fetchUsers,
};

export default usersSlice.reducer;
