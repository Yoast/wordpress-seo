import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { debounce, identity } from "lodash";
import { FETCH_DELAY } from "../../shared-admin/constants";
import { fetchJson } from "./fetch-json";

/**
 * @typedef {Object} FetchResult
 * @property {boolean} isPending Whether the fetch is pending.
 * @property {Error?} error The error, if any.
 * @property {any?} data The data, if any.
 */

/**
 * @typedef {function} FetchFunction
 * @param {string|URL} url The URL to fetch from.
 * @param {RequestInit} options The request options.
 * @returns {Promise<any|Error>} The promise of a result, or an error.
 */

/**
 * @param {any[]} dependencies The dependencies for the fetch.
 * @param {string|URL} url The URL to fetch from.
 * @param {RequestInit} options The request options.
 * @param {function(any): any} [prepareData] Transforms the data before "storage".
 * @param {FetchFunction} [doFetch] Fetches the data. Defaults to `fetchJson`.
 * @param {number} [fetchDelay] Debounce delay for fetching. Defaults to `FETCH_DELAY`.
 * @returns {FetchResult} The fetch result.
 */
export const useFetch = ( { dependencies, url, options, prepareData = identity, doFetch = fetchJson, fetchDelay = FETCH_DELAY } ) => {
	const [ isPending, setIsPending ] = useState( true );
	const [ error, setError ] = useState();
	const [ data, setData ] = useState();
	/** @type {MutableRefObject<AbortController>} */
	const controller = useRef();

	// This needs to be wrapped including setting the state, because the debounce return messes with the timing/events.
	const handleFetch = useCallback( debounce( ( ...args ) => {
		doFetch( ...args )
			.then( ( result ) => {
				setData( prepareData( result ) );
				setError( undefined ); // eslint-disable-line no-undefined
			} )
			.catch( ( e ) => {
				// Ignore abort errors, because they are expected.
				if ( e?.name !== "AbortError" ) {
					setError( e );
				}
			} )
			.finally( () => {
				setIsPending( false );
			} );
	}, fetchDelay ), [] );

	useEffect( () => {
		setIsPending( true );
		controller.current?.abort();
		controller.current = new AbortController();
		handleFetch( url, { signal: controller.current.signal, ...options } );

		return () => controller.current?.abort();
	}, dependencies );

	return {
		data,
		error,
		isPending,
	};
};
