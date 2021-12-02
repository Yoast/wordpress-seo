// External dependencies.
import { pickBy, isObject, isFunction } from "lodash";

// Internal dependencies.
import RequestError from "../errors/RequestError";
import ParseError from "../errors/ParseError";

/**
 * Indexing service class.
 */
export default class IndexingService {
	/**
	 * Constructs the indexing service.
	 *
	 * @param {Object}                   settings            The settings. Should include data for the REST API root and nonce.
	 * @param {Object<string, function>} preIndexingActions  Optional. The actions to run before an indexing request happens.
	 * @param {Object<string, function>} postIndexingActions Optional. The actions to run after an indexing request has happened.
	 */
	constructor( settings, preIndexingActions = [], postIndexingActions = [] ) {
		this.settings = settings;

		if ( isObject( preIndexingActions ) ) {
			this.preIndexingActions = pickBy( preIndexingActions, isFunction );
		} else {
			this.preIndexingActions = {};
		}
		if ( isObject( postIndexingActions ) ) {
			this.postIndexingActions = pickBy( postIndexingActions, isFunction );
		} else {
			this.postIndexingActions = {};
		}
	}

	/**
	 * Index endpoints.
	 *
	 * @param {Object<string, string>} endpoints The endpoints to call, a map of name to relative URL.
	 * @param {function}               progress  A function that's called when progress is made.
	 *
	 * @returns {Promise<number>} The promise.
	 */
	async index( endpoints, progress ) {
		if ( ! isObject( endpoints ) ) {
			return 0;
		}

		let count = 0;
		for ( const name of Object.keys( endpoints ) ) {
			const endpoint = endpoints[ name ];
			count = await this.handleEndpoint( name, endpoint, count, progress );
		}

		return count;
	}

	/**
	 * Does the indexing of a given endpoint.
	 *
	 * @param {string}   name     The name of the endpoint.
	 * @param {string}   endpoint The relative URL of the endpoint.
	 * @param {number}   count    The amount of items already processed.
	 * @param {function} progress A function that's called when progresss is made.

	 *
	 * @returns {Promise<number>} The indexing promise.
	 */
	async handleEndpoint( name, endpoint, count, progress ) {
		let url = this.settings.restApi.root + endpoint;

		while ( url !== false ) {
			await this.doPreIndexingAction( name );
			const response = await this.doIndexingRequest( url );
			await this.doPostIndexingAction( name, response );

			count = count + response.objects.length;
			progress( count );

			if ( response.next_url ) {
				url = this.settings.restApi.root + response.next_url;
			} else {
				url = false;
			}
		}

		return count;
	}

	/**
	 * Does an indexing request.
	 *
	 * @param {string} url The url of the indexing that should be done.
	 *
	 * @returns {Promise} The request promise.
	 */
	 async doIndexingRequest( url ) {
		const response = await fetch( url, {
			method: "POST",
			headers: {
				"X-WP-Nonce": this.settings.restApi.nonce,
			},
		} );

		const responseText = await response.text();

		let data;
		try {
			/*
			 * Sometimes, in case of a fatal error, or if WP_DEBUG is on and a DB query fails,
			 * non-JSON is dumped into the HTTP response body, so account for that here.
			 */
			data = JSON.parse( responseText );
		} catch ( error ) {
			throw new ParseError( "Error parsing the response to JSON.", responseText );
		}

		// Throw an error when the response's status code is not in the 200-299 range.
		if ( ! response.ok ) {
			const stackTrace = data.data ? data.data.stackTrace : "";
			throw new RequestError( data.message, url, "POST", response.status, stackTrace );
		}

		return data;
	}

	/**
	 * Does any registered indexing action *before* a call to an index endpoint.
	 *
	 * @param {string} endpoint The endpoint that has been called.
	 *
	 * @returns {Promise<void>} An empty promise.
	 */
	 async doPreIndexingAction( endpoint ) {
		if ( this.preIndexingActions[ endpoint ] ) {
			await this.preIndexingActions[ endpoint ]( this.settings );
		}
	}

	/**
	 * Does any registered indexing action *after* a call to an index endpoint.
	 *
	 * @param {string} endpoint The endpoint that has been called.
	 * @param {Object} response The response of the call to the endpoint.
	 *
	 * @returns {Promise<void>} An empty promise.
	 */
	async doPostIndexingAction( endpoint, response ) {
		if ( this.postIndexingActions[ endpoint ] ) {
			await this.postIndexingActions[ endpoint ]( response.objects, this.settings );
		}
	}
}
