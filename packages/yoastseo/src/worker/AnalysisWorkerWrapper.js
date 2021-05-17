// Internal dependencies.
import Request from "./request";
import Transporter from "./transporter";

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
		this.analyzeRelatedKeywords = this.analyzeRelatedKeywords.bind( this );
		this.loadScript = this.loadScript.bind( this );
		this.sendMessage = this.sendMessage.bind( this );
		this.runResearch = this.runResearch.bind( this );

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
		const request = this._requests[ id ];
		if ( ! request ) {
			console.warn( "AnalysisWebWorker unmatched response:", payload );
			return;
		}

		payload = Transporter.parse( payload );

		switch ( type ) {
			case "initialize:done":
			case "loadScript:done":
			case "customMessage:done":
			case "runResearch:done":
			case "analyzeRelatedKeywords:done":
			case "analyze:done":
				request.resolve( payload );
				break;
			case "analyze:failed":
			case "loadScript:failed":
			case "customMessage:failed":
			case "runResearch:failed":
			case "analyzeRelatedKeywords:failed":
				request.reject( payload );
				break;
			default:
				console.warn( "AnalysisWebWorker unrecognized action:", type );
		}

		// Remove the handled request from our queue.
		delete this._requests[ id ];
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
		/*
		 * Try to get the last request. This might not perfectly match the request error.
		 * However, that is not as bad as not being able to reject it like this.
		 *
		 * This is not the _autoIncrementedRequestId because that might be a
		 * request that is handled already. Instead the last object key is used.
		 */
		const requestKeys = Object.keys( this._requests );
		const lastRequestId = requestKeys[ requestKeys.length - 1 ];
		const lastRequest = this._requests[ lastRequestId ];
		if ( ! lastRequest ) {
			console.error( "AnalysisWebWorker error:", event );
			return;
		}
		lastRequest.reject( event );
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
	 * @param {number} id     The request id.
	 * @param {Object} [data] Optional extra data.
	 *
	 * @returns {Promise} The callback promise.
	 */
	createRequestPromise( id, data = {} ) {
		return new Promise( ( resolve, reject ) => {
			this._requests[ id ] = new Request( resolve, reject, data );
		} );
	}

	/**
	 * Sends a request to the worker and returns a promise that will resolve or reject once the worker finishes.
	 *
	 * @param {string} action  The action of the request.
	 * @param {Object} payload The payload of the request.
	 * @param {Object} [data]  Optional extra data.
	 *
	 * @returns {Promise} A promise that will resolve or reject once the worker finishes.
	 */
	sendRequest( action, payload, data = {} ) {
		const id = this.createRequestId();
		const promise = this.createRequestPromise( id, data );

		this.send( action, id, payload );
		return promise;
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
		payload = Transporter.serialize( payload );

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
		return this.sendRequest( "initialize", configuration );
	}

	/**
	 * Analyzes the paper.
	 *
	 * @param {Object} paper           The paper to analyze.
	 * @param {Object} relatedKeywords The related keywords.
	 *
	 * @returns {Promise} The promise of analyses.
	 */
	analyzeRelatedKeywords( paper, relatedKeywords = {} ) {
		return this.sendRequest( "analyzeRelatedKeywords", { paper, relatedKeywords } );
	}

	/**
	 * Analyzes the paper.
	 *
	 * @param {Object} paper           The paper to analyze.
	 *
	 * @returns {Promise} The promise of analyses.
	 */
	analyze( paper ) {
		return this.sendRequest( "analyze", { paper } );
	}

	/**
	 * Imports a script to the worker.
	 *
	 * @param {string} url The relative url to the script to be loaded.
	 *
	 * @returns {Promise} The promise of the script import.
	 */
	loadScript( url ) {
		return this.sendRequest( "loadScript", { url } );
	}

	/**
	 * Sends a custom message to the worker.
	 *
	 * @param {string} name       The name of the message.
	 * @param {string} data       The data of the message.
	 * @param {string} pluginName The plugin that registered this type of message.
	 *
	 * @returns {Promise} The promise of the custom message.
	 */
	sendMessage( name, data, pluginName ) {
		name = pluginName + "-" + name;
		return this.sendRequest( "customMessage", { name, data }, data );
	}

	/**
	 * Runs the specified research in the worker. Optionally pass a paper.
	 *
	 * @param {string} name    The name of the research to run.
	 * @param {Paper} [paper] The paper to run the research on if it shouldn't
	 *                         be run on the latest paper.
	 *
	 * @returns {Promise} The promise of the research.
	 */
	runResearch( name, paper = null ) {
		return this.sendRequest( "runResearch", { name, paper } );
	}
}

export default AnalysisWorkerWrapper;
