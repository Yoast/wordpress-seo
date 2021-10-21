import Transporter from "../worker/transporter";
import Scheduler from "../worker/scheduler";
import { getLogger } from "loglevel";

/**
 * The data of the message to the web worker.
 *
 * @typedef {Object} MessageData
 *
 * @property {number} id The id of the message.
 * @property {string} type The type of message.
 * @property {Object} payload The message's payload.
 */

/**
 * Handles messages sent to the web worker
 * and converts them into method calls on the analysis.
 */
export default class WorkerProxy {
	/**
	 * Creates a new message handler.
	 *
	 * @param {Object} scope The web worker global scope (e.g. `self`).
	 * @param {Analysis} analysis The analysis.
	 */
	constructor( scope, analysis ) {
		this.postMessage = scope.postMessage;
		scope.onMessage = this.handleMessage.bind( this );

		this._scheduler = new Scheduler();
		this._logger = getLogger( "yoast-analysis-worker" );
		this._logger.setDefaultLevel( "error" );
		this._customHandlers = {};
		this._analysis = analysis;
	}

	/**
	 * Handles a message that is sent to the web worker
	 * and routes it to the analysis by calling the appropriate method
	 * on the analysis.
	 *
	 * @param {MessageEvent<MessageData>} message The message sent to the web worker.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { id, type, payload } } ) {
		payload = Transporter.parse( payload );

		this._logger.debug( "AnalysisWebWorker incoming:", type, id, payload );

		if ( type === "initialize" ) {
			this._analysis.initialize( id, payload );
			this._scheduler.startPolling();
			return;
		}

		// Check if the message has a custom handler.
		if ( Object.keys( this._customHandlers ).includes( type ) ) {
			this._scheduler.schedule( {
				id,
				execute: this._customHandlers[ type ],
				done: this.done.bind( this ),
				data: payload,
				type: type,
			} );
			return;
		}

		// Check if the message has a handler on the analysis, if not: log an error.
		if ( typeof this._analysis[ type ] !== "function" ) {
			this._logger.error( `Trying to call non-existent method on ${this._analysis.constructor.name}: ${type}` );
			return;
		}

		// Schedule a message.
		this._scheduler.schedule( {
			id,
			execute: this._analysis[ type ],
			done: this.done.bind( this ),
			data: payload,
			type: type,
		} );
	}

	/**
	 * Registers a custom message handler.
	 *
	 * @param {string} type The message type.
	 * @param {function} handler The message handler.
	 *
	 * @returns {void}
	 */
	registerCustomHandler( type, handler ) {
		this._customHandlers[ type ] = handler;
	}

	/**
	 * Sends a 'done' message if the result was successful.
	 * Sends an error message if not.
	 *
	 * @param {number} id The message id.
	 * @param {Object} payload The message data.
	 * @param {string} type The message type.
	 *
	 * @returns {void}
	 */
	done( id, payload, type ) {
		if ( payload.error ) {
			type = `${type}:failed`;
			this.sendMessage( { type, id, payload } );
			return;
		}
		type = `${type}:done`;
		this.sendMessage( { type, id, payload } );
	}

	/**
	 * Sends a message back out of the web worker.
	 *
	 * @param {MessageData} message The message to send.
	 *
	 * @returns {void}
	 */
	sendMessage( { type, id, payload = {} } ) {
		this._logger.debug( "AnalysisWebWorker outgoing:", type, id, payload );

		payload = Transporter.serialize( payload );

		this.postMessage( {
			type,
			id,
			payload,
		} );
	}
}
