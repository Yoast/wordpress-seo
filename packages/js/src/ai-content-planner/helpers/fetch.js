import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";

const DEFAULT_TIMEOUT_SECONDS = 30;

/**
 * Marker object thrown when a fetch is cancelled by the caller (not by the timeout).
 * Callers can inspect `error.aborted` to distinguish a cancellation from a real failure
 * and skip dispatching a success or error action.
 *
 * @type {{ aborted: true }}
 */
export const ABORTED_ERROR = { aborted: true };

/**
 * Reads and parses the JSON body from a Response object.
 *
 * @param {Response} response The fetch Response.
 * @returns {Promise<Object>} The parsed JSON body, or an empty object on failure.
 */
async function readJsonBody( response ) {
	try {
		return await response.json();
	} catch ( e ) {
		return {};
	}
}

/**
 * Handles abort errors, distinguishing between timeout and user-initiated cancellation.
 *
 * @param {boolean} isTimeout Whether the abort was caused by a timeout.
 * @throws {{ errorCode: number, errorIdentifier: string, errorMessage: string }} On timeout.
 */
function handleAbortError( isTimeout ) {
	if ( isTimeout ) {
		throw { errorCode: 408, errorIdentifier: "", errorMessage: "timeout" };
	}
}

/**
 * Builds a structured error object from a failed HTTP response.
 *
 * @param {Response} error The error response.
 * @returns {Promise<Object>} The structured error with errorCode, errorIdentifier, and errorMessage.
 */
async function buildHttpError( error ) {
	const body = await readJsonBody( error );
	// Bad gateway error will not have a payload, so we set a default error.
	return {
		errorCode: error.status || 502,
		errorIdentifier: body.errorIdentifier || body.code || "",
		errorMessage: body.message || "",
	};
}

/**
 * Builds the apiFetch options object.
 *
 * @param {string}          path       The REST API path.
 * @param {string}          method     The HTTP method.
 * @param {Object}          data       The request body data.
 * @param {AbortController} controller The AbortController for the request.
 * @returns {Object} The fetch options.
 */
function buildFetchOptions( path, method, data, controller ) {
	const options = { path, method, parse: false, signal: controller.signal };
	if ( data ) {
		options.data = data;
	}
	return options;
}

/**
 * Performs an API fetch with timeout and abort handling.
 * Uses `parse: false` for full control over response and error parsing.
 *
 * On success, returns the parsed JSON payload.
 * On failure, throws a structured error: `{ errorCode, errorIdentifier, errorMessage }`.
 * On abort (non-timeout), throws `ABORTED_ERROR` so callers can silently ignore cancelled requests.
 *
 * @param {Object} options The fetch options.
 * @param {string} options.path The REST API path.
 * @param {string} [options.method="GET"] The HTTP method.
 * @param {Object} [options.data] The request body data (for POST requests).
 * @param {AbortController} [options.abortController] Optional AbortController for external cancellation.
 *
 * @returns {Promise<Object>} The parsed response payload.
 * @throws {{ errorCode: number, errorIdentifier: string, errorMessage: string }|{ aborted: true }} On fetch errors or user abort.
 */
export async function contentPlannerFetch( { path, method = "GET", data, abortController } ) {
	const controller = abortController || new AbortController();
	let isTimeout = false;
	const timeoutMs = get( window, "wpseoContentPlanner.requestTimeout", DEFAULT_TIMEOUT_SECONDS ) * 1000;

	const timerId = setTimeout( () => {
		isTimeout = true;
		controller.abort();
	}, timeoutMs );

	try {
		const response = await apiFetch( buildFetchOptions( path, method, data, controller ) );
		return await response.json();
	} catch ( error ) {
		if ( error instanceof DOMException && error.name === "AbortError" ) {
			handleAbortError( isTimeout );
			throw ABORTED_ERROR;
		}

		throw await buildHttpError( error );
	} finally {
		clearTimeout( timerId );
	}
}
