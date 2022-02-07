/* global yoastIndexingData */
import { Component, Fragment, useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { addHistoryState, removeSearchParam } from "../../helpers/urlHelpers";
import IndexingError from "./IndexingError";
import Alert from "./alert";
import RequestError from "../../errors/RequestError";
import ParseError from "../../errors/ParseError";
import AnimateHeight from "react-animate-height";

const STATE = {
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

/**
 * Indexes the site and shows a progress bar indicating the indexing process' progress.
 */
export class Indexation extends Component {
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

				this.setState( previousState => (
					{
						processed: previousState.processed + response.objects.length,
						firstTime: false,
					}
				) );

				url = response.next_url;
			} catch ( error ) {
				this.setState( {
					state: STATE.ERRORED,
					error: error,
					firstTime: false,
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

		this.props.indexingStateCallback( this.state.amount === 0 ? "completed" : this.state.state );

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

	/**
	 * Renders a notice if it is the first time the indexation is performed.
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	renderFirstIndexationNotice() {
		return (
			<Alert type={ "info" }>
				{ __( "This feature includes and replaces the Text Link Counter and Internal Linking Analysis", "wordpress-seo" ) }
			</Alert>
		);
	}

	/**
	 * Renders the start button.
	 *
	 * @returns {JSX.Element|null} The start button.
	 */
	renderStartButton() {
		return <button
			className="yst-button--secondary"
			onClick={ this.startIndexing }
		>
			{ __( "Start SEO data optimization", "wordpress-seo" ) }
		</button>;
	}

	/**
	 * Renders the stop button.
	 *
	 * @returns {JSX.Element|null} The stop button.
	 */
	renderStopButton() {
		return <button
			className="yst-button--secondary"
			onClick={ this.stopIndexing }
		>
			{ __( "Stop SEO data optimization", "wordpress-seo" ) }
		</button>;
	}

	/**
	 * Renders the disabled tool.
	 *
	 * @returns {JSX.Element} The disabled tool.
	 */
	renderDisabledTool() {
		return <Fragment>
			<p>
				<button
					className="yst-button--secondary"
					disabled={ true }
				>
					{ __( "Start SEO data optimization", "wordpress-seo" ) }
				</button>
			</p>
			<Alert type={ "info" }>
				{ __( "SEO data optimization is disabled for non-production environments.", "wordpress-seo" ) }
			</Alert>
		</Fragment>;
	}

	/**
	 * Renders the progress bar, plus caption.
	 *
	 * @returns {JSX.Element} The progress bar, plus caption.
	 */
	renderProgressBar() {
		let percentageIndexed = 0;
		if ( this.isState( STATE.COMPLETED ) ) {
			percentageIndexed = 100;
		}
		if ( this.isState( STATE.IN_PROGRESS ) ) {
			percentageIndexed = ( this.state.processed / parseInt( this.state.amount, 10 ) ) * 100;
		}

		return <Fragment>
			<div className="yst-w-full yst-bg-gray-200 yst-rounded-full yst-h-2.5 yst-mb-4">
				<div
					className="yst-transition-[width] yst-ease-linear yst-bg-primary-500 yst-h-2.5 yst-rounded-full"
					style={ { width: `${ percentageIndexed }%` } }
				/>
			</div>
			<AnimateHeight
				id="optimization-in-progress-text"
				height={ this.isState( STATE.IN_PROGRESS ) ? "auto" : 0 }
				easing="linear"
				duration={ 300 }
			>
				<p className={ "yst-text-sm yst-italic yst-mb-4" }>
					{
						__( "SEO data optimization is running… You can safely move on to the next steps of this configuration.",
							"wordpress-seo" )
					}
				</p>
			</AnimateHeight>
		</Fragment>;
	}

	/**
	 * Renders the error alert.
	 *
	 * @returns {JSX.Element} The error alert.
	 */
	renderErrorAlert() {
		return <IndexingError
			message={ yoastIndexingData.errorMessage }
			error={ this.state.error }
		/>;
	}

	/**
	 * Renders the indexing tool.
	 *
	 * @returns {JSX.Element} The indexing tool.
	 */
	renderTool() {
		return (
			<Fragment>
				{ this.renderProgressBar() }
				{ this.isState( STATE.ERRORED ) && this.renderErrorAlert() }
				{ this.isState( STATE.IDLE ) && this.state.firstTime && this.renderFirstIndexationNotice() }
				{ this.isState( STATE.IN_PROGRESS )
					? this.renderStopButton()
					: this.renderStartButton()
				}
			</Fragment>
		);
	}

	/**
	 * Renders the component
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	render() {
		if ( this.settings.disabled ) {
			return this.renderDisabledTool();
		}

		if ( this.isState( STATE.COMPLETED ) || this.state.amount === 0 ) {
			return <Alert type="success">{ __( "We’ve successfully analyzed your site!", "wordpress-seo" ) }</Alert>;
		}

		return this.renderTool();
	}
}

Indexation.propTypes = {
	indexingActions: PropTypes.object,
	preIndexingActions: PropTypes.object,
	indexingStateCallback: PropTypes.func,
};

Indexation.defaultProps = {
	indexingActions: {},
	preIndexingActions: {},
	indexingStateCallback: () => {},
};

export default Indexation;
