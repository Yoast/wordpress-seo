/* global yoastIndexingData */
import { Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ProgressBar, NewButton, Alert } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import PropTypes from "prop-types";

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
			amount: parseInt( this.settings.amount, 10 ),
			firstTime: ( this.settings.firstTime === "1" ),
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

		const data = await response.json();

		// Throw an error when the response's status code is not in the 200-299 range.
		if ( ! response.ok ) {
			throw new Error( data.message );
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
		let url = this.settings.restApi.root + this.settings.restApi.endpoints[ endpoint ];

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
		for ( const endpoint of Object.keys( this.settings.restApi.endpoints ) ) {
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

		const shouldStart = new URLSearchParams( window.location.search ).get( "start-indexation" ) === "true";

		if ( shouldStart ) {
			this.startIndexing();
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
		return <NewButton
			variant="primary"
			onClick={ this.startIndexing }
		>
			{ __( "Start SEO data optimization", "wordpress-seo" ) }
		</NewButton>;
	}

	/**
	 * Renders the stop button.
	 *
	 * @returns {JSX.Element|null} The stop button.
	 */
	renderStopButton() {
		return <NewButton
			variant="secondary"
			onClick={ this.stopIndexing }
		>
			{ __( "Stop SEO data optimization", "wordpress-seo" ) }
		</NewButton>;
	}

	/**
	 * Renders the disabled tool.
	 *
	 * @returns {JSX.Element} The disabled tool.
	 */
	renderDisabledTool() {
		return <Fragment>
			<p>
				<NewButton
					variant="secondary"
					disabled={ true }
				>
					{ __( "Start SEO data optimization", "wordpress-seo" ) }
				</NewButton>
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
		return <Fragment>
			<ProgressBar
				style={ { height: "16px", margin: "8px 0" } }
				progressColor={ colors.$color_pink_dark }
				max={ parseInt( this.state.amount, 10 ) }
				value={ this.state.processed }
			/>
			<p style={ { color: colors.$palette_grey_text } }>
				{ __( "Optimizing SEO data... This may take a while.", "wordpress-seo" ) }
			</p>
		</Fragment>;
	}

	/**
	 * Renders the error alert.
	 *
	 * @returns {JSX.Element} The error alert.
	 */
	renderErrorAlert() {
		return <Alert type={ "error" }>
			{ __( "Oops, something has gone wrong and we couldn't complete the optimization of your SEO data. " +
				  "Please click the button again to re-start the process.", "wordpress-seo" ) }
		</Alert>;
	}

	/**
	 * Renders the indexing tool.
	 *
	 * @returns {JSX.Element} The indexing tool.
	 */
	renderTool() {
		return (
			<Fragment>
				{ this.isState( STATE.IN_PROGRESS ) && this.renderProgressBar() }
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
			return <Alert type={ "success" }>{ __( "SEO data optimization complete", "wordpress-seo" ) }</Alert>;
		}

		return this.renderTool();
	}
}

Indexation.propTypes = {
	indexingActions: PropTypes.object,
	preIndexingActions: PropTypes.object,
};

Indexation.defaultProps = {
	indexingActions: {},
	preIndexingActions: {},
};

export default Indexation;
