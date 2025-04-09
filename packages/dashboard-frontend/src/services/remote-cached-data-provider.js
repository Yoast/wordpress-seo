import { defaultsDeep, forEach } from "lodash";
import { fetchJson } from "../fetch/fetch-json";
import {
	deleteItem,
	getItem,
	getKeys,
	setItem,
	STORAGE_KEY_PREFIX_ROOT,
} from './cache';

/**
 * Provides the mechanism to fetch data from a remote source.
 */
export class RemoteCachedDataProvider {
	#options;

	/**
	 * @param {RequestInit} options The fetch options.
	 * @throws {TypeError} If the baseUrl is invalid.
	 */
	constructor( options ) {
		this.#options = options;
	}

	/**
	 * @param {string|URL} endpoint The endpoint.
	 * @param {Object<string,string|Object<string,string>>} [params] The query parameters.
	 * @throws {TypeError} If the URL is invalid.
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/URL
	 * @returns {URL} The URL.
	 */
	getUrl( endpoint, params ) {
		const url = new URL( endpoint );

		forEach( params, ( value, key ) => {
			if ( typeof value === "object" ) {
				forEach( value, ( subValue, subKey ) => {
					url.searchParams.append( `${ key }[${ subKey }]`, subValue );
				} );
			} else {
				url.searchParams.append( key, value );
			}
		} );

		return url;
	}

	/**
	 * @param {string|URL} endpoint The endpoint.
	 * @param {Object<string,string|Object<string,string>>} [params] The query parameters.
	 * @param {RequestInit} [options] The request options.
	 * @returns {Promise<any|Error>} The promise of a result, or an error.
	 */
	async fetchJson( endpoint, params, options ) {
		const response = await fetchJson(
			this.getUrl( endpoint, params ),
			defaultsDeep( options, this.#options, { headers: { "Content-Type": "application/json" } } )
		);
		console.log( "response", response );

		if ( Array.isArray( response.uncacheableData ) && Array.isArray( response.cacheableData ) ) {
			// await setItem( widget, response.to_be_cached );
			if ( response.uncacheableData.length > 0 ) {
				return response.uncacheableData;
			}

			return response.cacheableData;
		} else {
			return response;
		}
	}
}
