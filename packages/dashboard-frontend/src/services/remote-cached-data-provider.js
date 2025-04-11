import { defaultsDeep } from "lodash";
import { fetchJson } from "../fetch/fetch-json";
import {
	deleteItem,
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
		// @TODO: We no longer return a promise since we now await, so we might have to cascade this change to the rest of the codebase where the RemoteCachedDataProvider is used.
		const response = await fetchJson(
			this.getUrl( endpoint, params ),
			defaultsDeep( options, this.getOptions(), { headers: { "Content-Type": "application/json" } } )
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
