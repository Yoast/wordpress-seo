export {
	META_FIELDS,
	HIDDEN_INPUT_ID_PREFIX,
	POST_META_KEY_PREFIX,
} from "./meta-fields";

/**
 * Keep constants centralized to avoid circular dependency problems.
 */
export const ASYNC_ACTION_NAMES = {
	request: "request",
	success: "success",
	error: "error",
};

export const ASYNC_ACTION_STATUS = {
	idle: "idle",
	loading: "loading",
	success: "success",
	error: "error",
};

export const VIDEO_FLOW = {
	showPlay: "showPlay",
	askPermission: "askPermission",
	isPlaying: "isPlaying",
};

export const STORES = {
	editor: "yoast-seo/editor",
	wp: {
		editor: "core/editor",
		core: "core",
	},
};

export const SYNC_TIME = {
	wait: 500,
	max: 1500,
};
