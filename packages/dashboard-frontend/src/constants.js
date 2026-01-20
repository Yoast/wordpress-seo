export const FETCH_DELAY = 200;

/** @typedef {"idle" | "loading" | "success" | "error"} AsyncActionStatuses */
export const ASYNC_ACTION_STATUS = {
	idle: "idle",
	loading: "loading",
	success: "success",
	error: "error",
};

/**
 * Keep constants centralized to avoid circular dependency problems.
 */
/** @typedef {"request" | "success" | "error"} AsyncActionNames */
export const ASYNC_ACTION_NAMES = {
	request: "request",
	success: "success",
	error: "error",
};
