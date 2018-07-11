// External dependencies.
import get from "lodash/get";
import noop from "lodash/noop";

// Internal dependencies.
import Worker from "./analysis.worker";

/**
 * Analysis worker is an API around the Web Worker.
 */
class AnalysisWorker {
	/**
	 * Initializes the AnalysisWorker class.
	 */
	constructor() {
		// Initialize instance variables.
		this._worker = new Worker();
		this._callbacks = {};
		this._ids = {};

		// Bind actions to this scope.
		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );

		// Bind events to this scope.
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
	 * @param {MessageEvent} arguments              The post message event.
	 * @param {Object}       arguments.data         The data object.
	 * @param {string}       arguments.data.type    The action type.
	 * @param {string}       arguments.data.payload The payload of the action.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, payload } } ) {
		let id;
		switch( type ) {
			case "initialize:done":
				id = this.getID( "initialize" );
				this.getCallback( "initialize", id )( null );
				break;
			case "analyze:done":
				id = this.getID( "analyze" );
				this.getCallback( "analyze", id )( null, payload );
				break;
			default:
				console.warn( "AnalysisWorker unrecognized action", type );
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
		console.warn( "AnalysisWorker message error:", event );
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
		console.error( "AnalysisWorker error:", event );
	}

	/**
	 * Get the current ID for a namespace.
	 *
	 * @param {string} name The namespace of the ID.
	 *
	 * @returns {number} The current ID.
	 */
	getID( name ) {
		return this._ids[ name ] || 0;
	}

	/**
	 * Auto increment an ID for a namespace, starting with 0.
	 *
	 * @param {string} name The namespace of the ID.
	 *
	 * @returns {number} The new ID.
	 */
	incrementID( name ) {
		if ( this._ids[ name ] ) {
			return ++this._ids[ name ];
		}
		return this._ids[ name ] = 0;
	}

	/**
	 * Retrieves the callback for a namespace.
	 *
	 * @param {string} name The namespace of the callback.
	 * @param {number} [id] The ID of the callback, defaults to current.
	 *
	 * @returns {function} The registered callback.
	 */
	getCallback( name, id = -1 ) {
		if ( id < 0 ) {
			id = this.getID( name );
		}
		return get( this._callbacks, [ name, id ], noop );
	}

	/**
	 * Initializes the callback for a namespace and id.
	 *
	 * @param {string}   name     The namespace of the callback.
	 * @param {number}   id       The ID of the callback.
	 * @param {function} callback The callback function.
	 *
	 * @returns {void}
	 */
	setCallback( name, id, callback ) {
		if ( ! this._callbacks[ name ] ) {
			this._callbacks[ name ] = {};
		}
		this._callbacks[ name ][ id ] = callback;
	}

	/**
	 * Creates a new Promise that uses the callback.
	 *
	 * @param {string} name The namespace of the callback.
	 * @param {number} id   The ID of the callback.
	 *
	 * @returns {Promise} The callback promise.
	 */
	createCallbackPromise( name, id ) {
		return new Promise( ( resolve, reject ) => {
			this.setCallback( name , id, ( error, result ) => {
				if ( error ) {
					return reject( new Error( error ) );
				}
				resolve( result );
			} );
		} );
	}

	/**
	 * Sends a message to the worker.
	 *
	 * @param {string}   type    The type of the message.
	 * @param {Object|*} payload The payload to deliver.
	 *
	 * @returns {void}
	 */
	postMessage( type, payload ) {
		this._worker.postMessage( {
			type,
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
		const name = "initialize";
		const id = this.incrementID( name );

		this.postMessage( name, configuration );

		return this.createCallbackPromise( name, id );
	}

	/**
	 * Analyzes the paper.
	 *
	 * @param {Object} paper         The paper to analyze.
	 * @param {Object} configuration The configuration specific to this
	 *                               analyzation.
	 *
	 * @returns {Promise} The promise of analyzation.
	 */
	analyze( paper, configuration = {} ) {
		const name = "analyze";
		const id = this.incrementID( name );

		this.postMessage( name, {
			id,
			paper,
			configuration,
		} );

		return this.createCallbackPromise( name, id );
	}
}

export default AnalysisWorker;
