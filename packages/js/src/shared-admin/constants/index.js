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

export const FETCH_DELAY = 200;
