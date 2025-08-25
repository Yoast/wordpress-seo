/**
 * Keep constants centralized to avoid circular dependency problems.
 */
/** @typedef {"request" | "success" | "error"} AsyncActionNames */
export const ASYNC_ACTION_NAMES = {
	request: "request",
	success: "success",
	error: "error",
};

/** @typedef {"idle" | "loading" | "success" | "error"} AsyncActionStatuses */
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

export const FETCH_DELAY = 200;

/**
 * The Redux store name of the editor.
 * @type {string}
 */
export const STORE_NAME_EDITOR = "yoast-seo/editor";
