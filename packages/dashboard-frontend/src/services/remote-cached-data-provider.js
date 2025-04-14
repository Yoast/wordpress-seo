import { defaultsDeep } from "lodash";
import { fetchJson } from "../fetch/fetch-json";
import {
	getItem,
	getKeys,
	setItem,
	STORAGE_KEY_PREFIX_ROOT,
} from './cache';
import { RemoteDataProvider } from "./remote-data-provider";

/**
 * Provides the mechanism to fetch cached data from a remote source.
 */
export class RemoteCachedDataProvider extends RemoteDataProvider {

	/**
	 * @param {string|URL} endpoint The endpoint.
	 * @param {Object<string,string|Object<string,string>>} [params] The query parameters.
	 * @param {RequestInit} [options] The request options.
	 * @returns {Object} The response.
	 */
	async fetchJson( endpoint, params, options ) {
		const { cacheHit, value, isError } = await getItem( params.options.widget );
		params.cachedData = ( cacheHit && ! isError ) ? value : {};

		const response = await fetchJson(
			this.getUrl( endpoint ),
			defaultsDeep(
				options,
				this.getOptions(),
				{
					method: 'POST',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify( params )
				}
			)
		);

		if ( Array.isArray( response.uncacheableData ) && Array.isArray( response.cacheableData ) ) {
			await setItem( params.options.widget, response.cacheableData );
			if ( response.uncacheableData.length > 0 ) {
				return response.uncacheableData;
			}

			return response.cacheableData;
		} else {
			return response;
		}
	}
}
