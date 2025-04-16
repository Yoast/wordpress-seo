import { defaultsDeep } from "lodash";
import { fetchJson } from "../fetch/fetch-json";
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
	 * @param {string} [key] The key.
	 * @returns {Object} The response.
	 */
	async fetchJson( endpoint, params, options, key ) {
		const cacheKey = "yoastseo_" + this.#yoastVersion + "_" + this.#storagePrefix + "_" + key;
		const { cacheHit, value, isError } = await getItem( cacheKey );
		if ( cacheHit && ! isError ) {
			return value;
		}

		const response = await fetchJson(
			this.getUrl( endpoint, params ),
			defaultsDeep( options, this.getOptions(), { headers: { "Content-Type": "application/json" } } )
		);

		await setItem( cacheKey, response, { ttl: this.#ttl } );

		return response;
	}
}
