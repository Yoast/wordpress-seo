import { cloneDeep, noop } from "lodash";

/**
 * @typedef {Object} trackingRoute A tracking route definition.
 * @property {object} data The data to track.
 * @property {string} endpoint The route endpoint.
 */

/**
 * Represents data that we want to track.
 */
export class DataTracker {
	#data;
	#endpoint;
	#remoteDataProvider;

	/**
	 * @param {trackingRoute} trackingRoute The data to track.
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider The remote data provider.
	 */
	constructor( trackingRoute, remoteDataProvider ) {
		this.#data = trackingRoute.data;
		this.#endpoint = trackingRoute.endpoint;
		this.#remoteDataProvider = remoteDataProvider;
	}

	/**
	 * @param {string} element The element to get the value for.
	 * @returns {*} the value of the element.
	 */
	getTrackingElement( element ) {
		return this.#data?.[ element ];
	}

	/**
	 *
	 * @param {object} values The data to track.
	 */
	track( values ) {
		const trackingData = cloneDeep( this.#data );

		let hasDataChanged = false;
		/* eslint-disable no-undefined */
		Object.entries( values ).forEach( ( [ key, value ] ) => {
			if ( trackingData[ key ] !== undefined && trackingData[ key ] !== value ) {
				trackingData[ key ] = value;
				hasDataChanged = true;
			}
		} );

		// We update the object in memory and perform a REST request only if the data has changed.
		if ( hasDataChanged ) {
			this.#data = trackingData;
			this.storeData( trackingData );
		}
	}

	/**
	 * Store the setup steps tracking data.
	 *
	 * @param {object} data The setup steps tracking data.
	 * @param {object} [options] The HTTP options.
	 */
	storeData( data, options ) {
		this.#remoteDataProvider.fetchJson(
			this.#endpoint,
			data,
			{ ...options, method: "POST" }
		).catch( noop );
	}
}
