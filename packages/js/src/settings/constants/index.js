/**
 * Keep constants centralized to avoid circular dependency problems.
 */
export const STORE_NAME = "@yoast/settings";

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
