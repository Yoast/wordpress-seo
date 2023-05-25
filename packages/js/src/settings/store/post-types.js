import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, omit, pick } from "lodash";
import apiFetch from "@wordpress/api-fetch";

/**
 * @returns {Object} The initial state.
 */
export const createInitialPostTypesState = () => get( window, "wpseoScriptData.postTypes", {} );

const UPDATE_REVIEW_ACTION_NAME = "updatePostTypeReviewStatus";

/**
 * @param {String} postTypeName The query data.
 * @returns {Object} Success or error action object.
 */
export function* updatePostTypeReviewStatus( postTypeName ) {
	try {
		yield{
			type: UPDATE_REVIEW_ACTION_NAME,
			payload: postTypeName,
		};
	} catch ( error ) {
		// Empty.
	}
	return { type: `${ UPDATE_REVIEW_ACTION_NAME }/result`, payload: postTypeName };
}

const slice = createSlice( {
	name: "postTypes",
	initialState: createInitialPostTypesState(),
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( `${ UPDATE_REVIEW_ACTION_NAME }/result`, ( state, { payload } ) => {
			state[ payload ].needsReview = false;
		} );
	},
} );

export const postTypesSelectors = {
	selectPostType: ( state, postType, defaultValue = {} ) => get( state, `postTypes.${ postType }`, defaultValue ),
	selectAllPostTypes: ( state, postTypes = null ) => {
		const all = get( state, "postTypes", {} );
		return postTypes ? pick( all, postTypes ) : all;
	},
};
// Create an exception for the `attachment` post type. In the selectors instead of everywhere in the codebase.
postTypesSelectors.selectPostTypes = createSelector(
	postTypesSelectors.selectAllPostTypes,
	postTypes => omit( postTypes, [ "attachment" ] )
);

export const updatePostTypeReviewControls = {
	[ UPDATE_REVIEW_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		path: "/yoast/v1/needs-review/dismiss-post-type",
		method: "POST",
		data: { postTypeName: payload },
	} ),
};

export const postTypesActions = {
	...slice.actions,
	updatePostTypeReviewStatus,
};

export default slice.reducer;
