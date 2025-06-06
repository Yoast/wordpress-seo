import { getItem, setItem } from "./cache";
import { RemoteDataProvider } from "./remote-data-provider";

/**
 * Provides the mechanism to fetch cached data from a remote source.
 */
export class RemoteCachedDataProvider extends RemoteDataProvider {
	#storagePrefix;
	#yoastVersion;
	#ttl;

	/**
	 * @param {RequestInit} options The fetch options.
	 * @param {string} storagePrefix The storage prefix.
	 * @param {string} yoastVersion The Yoast version.
	 * @param {number} ttl The cache's TTL.
	 * @throws {TypeError} If the TTL value is invalid.
	 */
	constructor( options, storagePrefix, yoastVersion, ttl ) {
		super( options );

		this.#storagePrefix = storagePrefix;
		this.#yoastVersion = yoastVersion;

		if ( ! Number.isInteger( ttl ) || ttl <= 0 ) {
			throw new TypeError( "The TTL provided must be a positive integer." );
		}
		this.#ttl = ttl;
	}

	/**
	 * @param {string|URL} endpoint The endpoint.
	 * @param {Object<string,string|Object<string,string>>} [params] The query parameters.
	 * @param {RequestInit} [options] The request options.
	 * @returns {Object} The response.
	 */
	async fetchJson( endpoint, params, options ) {
		const yoastPrefix = "yoastseo";
		const finalCacheKey = yoastPrefix + "_" + this.#yoastVersion + "_" + this.#storagePrefix + "_" + params.options.widget;

		const { cacheHit, value } = getItem( finalCacheKey );
		if ( cacheHit ) {
			return value;
		}

		const response = await super.fetchJson( endpoint, params, options );

		setItem( finalCacheKey, response, { ttl: this.#ttl } );

		return response;
	}
}
