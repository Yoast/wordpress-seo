/* eslint-disable complexity */
import { get } from "lodash";
import apiFetch from "@wordpress/api-fetch";
import { FETCH_RESPONSE_STATUS } from "../constants";

let abortController;
let isTimeout = false;
const LOCALE_VARIANTS = [ "_formal", "_informal", "_ao90" ];

/**
 * Gets the additional error message from the Response body.
 * @param {Response} error The error response.
 * @returns {Promise<Object>} The promise of the error data.
 */
const getAdditionalErrorData = async( error ) => {
	try {
		const errorBodyStreamReader = error.body.getReader();
		const { value } = await errorBodyStreamReader.read();
		const decoder = new TextDecoder( "utf-8" );
		const decodedValue = decoder.decode( value );
		console.error( decodedValue );
		return JSON.parse( decodedValue );
	} catch ( e ) {
		return { message: "Unknown" };
	}
};

/**
 * Removes variant suffixes from locale, to make it a valid ISO 639-1 language.
 * @param {string} locale The locale.
 * @returns {string} The locale, with variant suffixes stripped out.
 */
export const removesLocaleVariantSuffixes = ( locale ) => {
	for ( const variant of LOCALE_VARIANTS ) {
		if ( locale.endsWith( variant ) ) {
			return locale.slice( 0, ( -variant.length ) );
		}
	}

	return locale;
};

/**
 * @param {string} endpoint The REST endpoint that will be called by the fetch instruction.
 * @param {object} data The data that .will be sent to the endpoint.
 * @returns {Promise<{status: string, payload: any}|{status: string}>} The promise of a response.
 */
export const fetchSuggestions = async( { endpoint, data } ) => {
	let timerId;
	const TIMEOUT_IN_MS = get( window, "wpseoAiGenerator.requestTimeout", 30 ) * 1000;

	try {
		if ( abortController ) {
			abortController.abort();
		}
		abortController = new AbortController();

		isTimeout = false;
		timerId = setTimeout( () => {
			isTimeout = true;
			abortController.abort();
		}, TIMEOUT_IN_MS );

		const response = await apiFetch( {
			path: endpoint,
			method: "POST",
			data: data,
			// Do not attempt to parse the response directly as we have separate error handling below.
			parse: false,
			...{ signal: abortController.signal },
		} );
		const result = await response.json();

		return { status: FETCH_RESPONSE_STATUS.success, payload: result };
	} catch ( error ) {
		if ( error instanceof DOMException && error.name === "AbortError" ) {
			if ( isTimeout ) {
				return { status: FETCH_RESPONSE_STATUS.error, payload: { message: "timeout", code: 408 } };
			}
			return { status: FETCH_RESPONSE_STATUS.abort };
		}

		const { message, missingLicenses, errorIdentifier } = await getAdditionalErrorData( error );

		return { status: FETCH_RESPONSE_STATUS.error, payload: { message, code: error.status || 500, missingLicenses, errorIdentifier } };
	} finally {
		clearTimeout( timerId );
	}
};
