// External dependencies.
const forEach = require( "lodash/forEach" );

// Internal dependencies.
import Request from "./request";
const AssessmentResult = require( "../values/AssessmentResult" );

/**
 * Analysis worker is an API around the Web Worker.
 */
class AnalysisWorkerWrapper {
	/**
	 * Initializes the AnalysisWorkerWrapper class.
	 *
	 * @param {Worker} worker The worker to wrap.
	 *
	 * @constructor
	 */
	constructor( worker ) {
		// Initialize instance variables.
		this._worker = worker;
		this._requests = {};
		this._autoIncrementedRequestId = -1;

		// Bind actions to this scope.
		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind( this );
		this.handleMessageError = this.handleMessageError.bind( this );
		this.handleError = this.handleError.bind( this );

		// Initialize the worker event handlers.
		this._worker.onmessage = this.handleMessage;
		this._worker.onmessageerror = this.handleMessageError;
		this._worker.onerror = this.handleError;
	}

	/**
	 * Receives the messages and determines the action.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
	 *
	 * @param {MessageEvent} event              The post message event.
	 * @param {Object}       event.data         The data object.
	 * @param {string}       event.data.type    The action type.
	 * @param {number}       event.data.id      The request id.
	 * @param {string}       event.data.payload The payload of the action.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, id, payload } } ) {
		let request;
		console.log( "wrapper", type, id, payload );

		switch( type ) {
			case "initialize:done":
				request = this._requests[ id ];
				if ( ! request ) {
					console.warn( "AnalysisWebWorker: unmatched response", payload );
					break;
				}

				request.resolve( payload );
				break;
			case "analyze:done":
				request = this._requests[ id ];
				if ( ! request ) {
					console.warn( "AnalysisWebWorker: unmatched response", payload );
					break;
				}

				// Map the results back to classes, because we encode and decode the message payload.
				if ( payload.seo ) {
					forEach( payload.seo, ( { results }, key ) => {
						payload.seo[ key ].results = results.map( result => AssessmentResult.parse( result ) );
					} );
				}
				if ( payload.readability ) {
					payload.readability.results = payload.readability.results.map( result => AssessmentResult.parse( result ) );
				}

				request.resolve( payload );
				break;
			default:
				console.warn( "AnalysisWebWorker: unrecognized action", type );
		}
	}

	/**
	 * Receives the message errors.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/Events/messageerror
	 *
	 * @param {MessageEvent} event The message event for the error that
	 *                             occurred.
	 *
	 * @returns {void}
	 */
	handleMessageError( event ) {
		console.warn( "AnalysisWebWorker message error:", event );
	}

	/**
	 * Receives the errors.
	 *
	 * See:
	 * https://developer.mozilla.org/en-US/docs/Web/API/AbstractWorker/onerror
	 *
	 * @param {Error} event The error event.
	 *
	 * @returns {void}
	 */
	handleError( event ) {
		console.error( "AnalysisWebWorker error:", event );
	}

	/**
	 * Increments the request id.
	 *
	 * @returns {number} The incremented id.
	 */
	createRequestId() {
		this._autoIncrementedRequestId++;
		return this._autoIncrementedRequestId;
	}

	/**
	 * Creates a new request inside a Promise.
	 *
	 * @param {number} id The request id.
	 *
	 * @returns {Promise} The callback promise.
	 */
	createRequestPromise( id ) {
		return new Promise( ( resolve, reject ) => {
			this._requests[ id ] = new Request( resolve, reject );
		} );
	}

	/**
	 * Sends a message to the worker.
	 *
	 * @param {string} type      The message type.
	 * @param {number} id        The request id.
	 * @param {Object} [payload] The payload to deliver.
	 *
	 * @returns {void}
	 */
	send( type, id, payload = {} ) {
		this._worker.postMessage( {
			type,
			id,
			payload,
		} );
	}

	/**
	 * Initializes the worker with a configuration.
	 *
	 * @param {Object} configuration The configuration to initialize the worker
	 *                               with.
	 *
	 * @returns {Promise} The promise of initialization.
	 */
	initialize( configuration ) {
		const id = this.createRequestId();
		const promise = this.createRequestPromise( id );

		this.send( "initialize", id, configuration );
		return promise;
	}

	/**
	 * Analyzes the paper.
	 *
	 * @param {Object} paper           The paper to analyze.
	 * @param {Object} relatedKeywords The related keywords.
	 *
	 * @returns {Promise} The promise of analyses.
	 */
	analyze( paper, relatedKeywords = {} ) {
		const id = this.createRequestId();
		const promise = this.createRequestPromise( id );

		this.send( "analyze", id, { paper, relatedKeywords } );
		return promise;
	}
}

export default AnalysisWorkerWrapper;
