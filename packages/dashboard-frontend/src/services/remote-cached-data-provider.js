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

	/**
	 * @param {RequestInit} options The fetch options.
	 * @param {string} storagePrefix The storage prefix.
	 * @param {string} yoastVersion The Yoast version.
	 * @throws {TypeError} If the baseUrl is invalid.
	 */
	constructor( options, storagePrefix, yoastVersion ) {
		super( options );

		this.#storagePrefix = storagePrefix;
		this.#yoastVersion = yoastVersion;
	}

	/**
	 * @param {string|URL} endpoint The endpoint.
	 * @param {Object<string,string|Object<string,string>>} [params] The query parameters.
	 * @param {RequestInit} [options] The request options.
	 * @returns {Object} The response.
	 */
	async fetchJson( endpoint, params, options ) {
		const cacheKey = "yoastseo_" + this.#yoastVersion + "_" + this.#storagePrefix + "_" + params.options.widget;
		const { cacheHit, value, isError } = await getItem( cacheKey );
		params.cachedData = ( cacheHit && ! isError ) ? value : {};

		const response = await fetchJson(
			this.getUrl( endpoint ),
			defaultsDeep(
				options,
				this.getOptions(),
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify( params ),
				}
			)
		);

		if ( Array.isArray( response.uncacheableData ) && Array.isArray( response.cacheableData ) ) {
			await setItem( cacheKey, response.cacheableData );
			if ( response.uncacheableData.length > 0 ) {
				return response.uncacheableData;
			}

			return response.cacheableData;
		}

		return response;
	}
}
