/* eslint-disable camelcase, complexity */
import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import {buildQueryString} from "@wordpress/url";
import {get, map, trim} from "lodash";
import {ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS} from "../constants";

const postsAdapter = createEntityAdapter();

export const FETCH_POSTS_ACTION_NAME = "fetchPosts";

/**
 * @param {Object} queryData The query data.
 * @returns {Object} Success or error action object.
 */
export function* fetchPosts(queryData) {
	yield{type: `${FETCH_POSTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}`};
	try {
		// Trigger the fetch posts control flow.
		const posts = yield{
			type: FETCH_POSTS_ACTION_NAME,
			payload: {...queryData},
		};
		return {type: `${FETCH_POSTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`, payload: posts};
	} catch (error) {
		return {type: `${FETCH_POSTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`, payload: error};
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialPostsState = () => postsAdapter.getInitialState({
	status: ASYNC_ACTION_STATUS.idle,
	error: "",
});

/**
 * @param {Object} post The post.
 * @returns {Object} The prepared and predictable user.
 */
const preparePost = post => (
	{
		id: post?.id,
		// Fallbacks for post title, because we always need something to show.
		name: trim(post?.title.rendered) || post?.slug || post?.id,
		slug: post?.slug,
	});

const postsSlice = createSlice({
	name: "posts",
	initialState: createInitialPostsState(),
	reducers: {
		addOnePost: {
			reducer: postsAdapter.addOne,
			prepare: post => ({payload: preparePost(post)}),
		},
		addManyPosts: {
			reducer: postsAdapter.addMany,
			prepare: posts => ({payload: map(posts, preparePost)}),
		},
	},
	extraReducers: (builder) => {
		builder.addCase(`${FETCH_POSTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}`, (state) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		});
		builder.addCase(`${FETCH_POSTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`, (state, action) => {
			state.status = ASYNC_ACTION_STATUS.success;
			postsAdapter.addMany(state, map(action.payload, preparePost));
		});
		builder.addCase(`${FETCH_POSTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`, (state, action) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		});
	},
});

// Prefix selectors
const postAdapterSelectors = postsAdapter.getSelectors(state => state.posts);

export const postsSelectors = {
	selectPostIds: postAdapterSelectors.selectIds,
	selectPostById: postAdapterSelectors.selectById,
	selectPosts: postAdapterSelectors.selectEntities,
	selectPostsFetchStatus: state => get(state, "posts.status", {}),
};
postsSelectors.selectPostsWith = createSelector(
	[
		postsSelectors.selectPosts,
		(state, additionalPost = {}) => additionalPost
	],
	(posts, additionalPost) => {
		let additionalPosts = {};
		additionalPost.forEach(post => {
			if (post?.id && !posts[post.id]) {
				// Add the additional user.
				additionalPosts[post.id] = {...post};
			}
		})

		return {...additionalPosts,...posts};
	}
);
export const postsActions = {
	...postsSlice.actions,
	fetchPosts,
};

export const postsControls = {
	[FETCH_POSTS_ACTION_NAME]: async ({payload}) => apiFetch({
		path: `/wp/v2/posts?${buildQueryString(payload)}`,
	}),
};

export default postsSlice.reducer;
