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
	 * @throws {TypeError} If the baseUrl is invalid.
	 */
	constructor( options, storagePrefix, yoastVersion, ttl ) {
		super( options );

		this.#storagePrefix = storagePrefix;
		this.#yoastVersion = yoastVersion;
		this.#ttl = ttl;
	}

	/**
	 * @param {string|URL} endpoint The endpoint.
	 * @param {Object<string,string|Object<string,string>>} [params] The query parameters.
	 * @param {RequestInit} [options] The request options.
	 * @param {string} [cacheKey] The cache key.
	 * @returns {Object} The response.
	 */
	async fetchJson( endpoint, params, options, cacheKey ) {
		const yoastPrefix = "yoastseo";
		const finalCacheKey = yoastPrefix + "_" + this.#yoastVersion + "_" + this.#storagePrefix + "_" + cacheKey;
		const { cacheHit, value, isError } = await getItem( finalCacheKey );
		if ( cacheHit && ! isError ) {
			return value;
		}

		const response = await super.fetchJson( endpoint, params, options );

		await setItem( finalCacheKey, response, { ttl: this.#ttl } );

		return response;
	}
}
