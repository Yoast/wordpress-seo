import { defaultsDeep, forEach } from "lodash";
import { fetchJson } from "../fetch/fetch-json";

/**
 * Provides the mechanism to fetch data from a remote source.
 */
export class RemoteDataProvider {
	#options;
	#doFetch;

	/**
	 * @param {RequestInit} options The default fetch options.
	 * @param {function(string, RequestInit): Promise<any>} [doFetch] The fetch function.
	 * @throws {TypeError} If the baseUrl is invalid.
	 */
	constructor( options, doFetch = fetchJson ) {
		this.#options = options;
		this.#doFetch = doFetch;
	}

	/**
	 * @returns {RequestInit} The fetch options.
	 */
	getOptions() {
		return this.#options;
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
		return this.#doFetch(
			this.getUrl( endpoint, params ),
			defaultsDeep( options, this.#options, { headers: { "Content-Type": "application/json" } } )
		);
	}
}
