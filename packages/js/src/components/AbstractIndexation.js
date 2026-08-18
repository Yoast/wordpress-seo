/* global yoastIndexingData */
import { Component, flushSync } from "@wordpress/element";
import PropTypes from "prop-types";
import { addHistoryState, removeSearchParam } from "../helpers/urlHelpers";
import RequestError from "../errors/RequestError";
import ParseError from "../errors/ParseError";

export const STATE = {
	/**
	 * When the process has not started yet, or has been stopped manually.
	 */
	IDLE: "idle",
	/**
	 * When the indexing process is in progress.
	 */
	IN_PROGRESS: "in_progress",
	/**
	 * When an error has occurred during the indexing process that has stopped the process.
	 */
	ERRORED: "errored",
	/**
	 * When the indexing process has finished.
	 */
	COMPLETED: "completed",
};

/* eslint-disable react/no-unused-state -- `error`/`firstTime` are set here but read by subclass render methods, unseen by this rule across files. */

/**
 * Drives the indexing process: calls each indexing endpoint in turn and tracks progress.
 *
 * This base class holds the full request/cursor engine and state machine shared by every
 * Indexation UI. Subclasses supply only the presentation by implementing `render()` (and the
 * `render*` helpers it calls); they may override `getAlreadyIndexedStateName()` to change the
 * state signalled when there is nothing left to index on mount.
 */
class AbstractIndexation extends Component {
	/**
	 * Indexing constructor.
	 *
	 * @param {Object} props The properties.
	 */
	constructor( props ) {
		super( props );

		this.settings = yoastIndexingData;

		this.state = {
			state: STATE.IDLE,
			processed: 0,
			error: null,
			amount: parseInt( this.settings.amount, 10 ),
			firstTime: (
				this.settings.firstTime === "1"
			),
		};

		this.startIndexing = this.startIndexing.bind( this );
		this.stopIndexing = this.stopIndexing.bind( this );
	}

	/**
	 * The state name signalled to `indexingStateCallback` when there is nothing left to index on mount.
	 *
	 * @returns {string} The state name.
	 */
	getAlreadyIndexedStateName() {
		return "completed";
	}

	/**
	 * Does an indexing request.
	 *
	 * @param {string} url   The url of the indexing that should be done.
	 * @param {string} nonce The WordPress nonce value for in the header.
	 *
	 * @returns {Promise} The request promise.
	 */
	async doIndexingRequest( url, nonce ) {
		const response = await fetch( url, {
			method: "POST",
			headers: {
				"X-WP-Nonce": nonce,
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
			const errorData = data.data || {};
			throw new RequestError( data.message, url, "POST", response.status, errorData.stackTrace, {
				objectId: errorData.object_id,
				objectType: errorData.object_type,
			} );
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
		if ( typeof this.props.preIndexingActions[ endpoint ] === "function" ) {
			await this.props.preIndexingActions[ endpoint ]( this.settings );
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
		if ( typeof this.props.indexingActions[ endpoint ] === "function" ) {
			await this.props.indexingActions[ endpoint ]( response.objects, this.settings );
		}
	}

	/**
	 * Does the indexing of a given endpoint.
	 *
	 * @param {string} endpoint The endpoint.
	 *
	 * @returns {Promise} The indexing promise.
	 */
	async doIndexing( endpoint ) {
		let url = this.settings.restApi.root + this.settings.restApi.indexing_endpoints[ endpoint ];

		while ( this.isState( STATE.IN_PROGRESS ) && url !== false ) {
			try {
				await this.doPreIndexingAction( endpoint );
				const response = await this.doIndexingRequest( url, this.settings.restApi.nonce );
				await this.doPostIndexingAction( endpoint, response );

				flushSync( () => {
					this.setState( previousState => (
						{
							processed: previousState.processed + response.objects.length,
							firstTime: false,
						}
					) );
				} );

				url = response.next_url;
			} catch ( error ) {
				flushSync( () => {
					this.setState( {
						state: STATE.ERRORED,
						error: error,
						firstTime: false,
					} );
				} );
			}
		}
	}

	/**
	 * Indexes the objects by calling each indexing endpoint in turn.
	 *
	 * @returns {Promise<void>} The indexing promise.
	 */
	async index() {
		for ( const endpoint of Object.keys( this.settings.restApi.indexing_endpoints ) ) {
			await this.doIndexing( endpoint );
		}
		/*
		 * Set the indexing process as completed only when there is no error
		 * and the user has not stopped the process manually.
		 */
		if ( ! this.isState( STATE.ERRORED ) && ! this.isState( STATE.IDLE ) ) {
			this.completeIndexing();
		}
	}

	/**
	 * Starts the indexing process.
	 *
	 * @returns {Promise<void>} The start indexing promise.
	 */
	async startIndexing() {
		/*
		 * Since `setState` is asynchronous in nature, we have to supply a callback
		 * to make sure the state is correctly set before trying to call the first
		 * endpoint.
		 */
		this.setState( { processed: 0, state: STATE.IN_PROGRESS }, this.index );
	}

	/**
	 * Sets the state of the indexing process to completed.
	 *
	 * @returns {void}
	 */
	completeIndexing() {
		this.setState( { state: STATE.COMPLETED } );
	}

	/**
	 * Stops the indexing process.
	 *
	 * @returns {void}
	 */
	stopIndexing() {
		this.setState( previousState => (
			{
				state: STATE.IDLE,
				processed: 0,
				amount: previousState.amount - previousState.processed,
			}
		) );
	}

	/**
	 * Start indexation on mount, when redirected from the "Start SEO data optimization" button in the dashboard notification.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		if ( this.settings.disabled ) {
			return;
		}

		this.props.indexingStateCallback( this.state.amount === 0 ? this.getAlreadyIndexedStateName() : this.state.state );

		const shouldStart = new URLSearchParams( window.location.search ).get( "start-indexation" ) === "true";

		if ( shouldStart ) {
			const currentURL = removeSearchParam( window.location.href, "start-indexation" );
			addHistoryState( null, document.title, currentURL );

			this.startIndexing();
		}
	}

	/**
	 * Signals state changes to an optional callback function.
	 *
	 * @param {Object} _prevProps The previous props, unused in the current implementation.
	 * @param {Object} prevState  The previous state.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( _prevProps, prevState ) {
		if ( this.state.state !== prevState.state ) {
			this.props.indexingStateCallback( this.state.state );
		}
	}

	/**
	 * If the current state of the indexing process is the given state.
	 *
	 * @param {STATE.IDLE|STATE.ERRORED|STATE.IN_PROGRESS|STATE.COMPLETED} state The state value to check against.
	 *
	 * @returns {boolean} If the current state of the indexing process is the given state.
	 */
	isState( state ) {
		return this.state.state === state;
	}
}

/* eslint-enable react/no-unused-state */

/**
 * The prop types shared by every Indexation component.
 *
 * Exported as a plain object (rather than read back off `AbstractIndexation.propTypes`) so
 * subclasses can extend it without tripping `react/forbid-foreign-prop-types`.
 *
 * @type {Object}
 */
export const indexationPropTypes = {
	indexingActions: PropTypes.object,
	preIndexingActions: PropTypes.object,
	indexingStateCallback: PropTypes.func,
};

/**
 * The default props shared by every Indexation component.
 *
 * @type {Object}
 */
export const indexationDefaultProps = {
	indexingActions: {},
	preIndexingActions: {},
	indexingStateCallback: () => {},
};

AbstractIndexation.propTypes = indexationPropTypes;
AbstractIndexation.defaultProps = indexationDefaultProps;

export default AbstractIndexation;
