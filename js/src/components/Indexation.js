/* global yoastIndexingData */
import { Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ProgressBar } from "@yoast/components";
import { Alert } from "@yoast/components";
import { colors } from "@yoast/style-guide";

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
			inProgress: false,
			processed: 0,
			amount: this.settings.amount,
			error: null,
			preIndexingActions: {},
			indexingActions: {},
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
		return response.json();
	}

	/**
	 * Does any registered indexing action *before* a call to an index endpoint.
	 *
	 * @param {string} endpoint The endpoint that has been called.
	 *
	 * @returns {Promise<void>} An empty promise.
	 */
	async doPreIndexingAction( endpoint ) {
		if ( typeof this.state.preIndexingActions[ endpoint ] === "function" ) {
			await this.state.preIndexingActions[ endpoint ]( this.settings );
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
		if ( typeof this.state.indexingActions[ endpoint ] === "function" ) {
			await this.state.indexingActions[ endpoint ]( response.objects, this.settings );
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

		while ( this.state.inProgress && url !== false && this.state.processed <= this.state.amount ) {
			try {
				await this.doPreIndexingAction( endpoint );
				const response = await this.doIndexingRequest( url, this.settings.restApi.nonce );
				await this.doPostIndexingAction( endpoint, response );

				this.setState( previousState => (
					{ processed: previousState.processed + response.objects.length }
				) );

				url = response.next_url;
			} catch ( error ) {
				this.setState( { inProgress: false, error } );
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
		if ( ! this.state.error && this.state.inProgress ) {
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
		this.setState( { processed: 0, inProgress: true, error: null }, this.index );
	}

	/**
	 * Sets the state of the indexing process to completed.
	 *
	 * @returns {void}
	 */
	completeIndexing() {
		this.setState( previousState => (
			{
				inProgress: false,
				processed: previousState.amount,
			}
		) );
	}

	/**
	 * Stops the indexing process.
	 *
	 * @returns {void}
	 */
	stopIndexing() {
		this.setState( previousState => (
			{
				inProgress: false,
				amount: previousState.amount - previousState.processed,
			}
		) );
	}

	/**
	 * Sets the preindexing actions.
	 *
	 * @param {Object} preIndexingActions The preindexing actions.
	 *
	 * @returns {void}
	 */
	setPreIndexingActions( preIndexingActions ) {
		this.setState( { preIndexingActions } );
	}

	/**
	 * Sets the indexing actions.
	 *
	 * @param {Object} indexingActions The indexing actions.
	 *
	 * @returns {void}
	 */
	setIndexingActions( indexingActions ) {
		this.setState( { indexingActions } );
	}

	/**
	 * Renders the component
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	render() {
		if ( this.settings.disabled ) {
			return <Fragment>
				<p>
					<button
						className="yoast-button yoast-button--secondary"
						type="button"
						disabled={ true }
					>
						{ __( "Start SEO data optimization", "wordpress-seo" ) }
					</button>
				</p>
				<Alert type={ "info" }>
					{ __( "This button to optimize the SEO data for your website is disabled for non-production environments.", "wordpress-seo" ) }
				</Alert>
			</Fragment>;
		}

		if ( this.state.processed >= this.state.amount ) {
			return <Alert type={ "success" }>{ __( "SEO data optimization complete", "wordpress-seo" ) }</Alert>;
		}

		return (
			<Fragment>
				{
					this.state.inProgress && <Fragment>
						<ProgressBar
							style={ { height: "16px", margin: "8px 0" } }
							progressColor={ colors.$color_pink_dark }
							max={ parseInt( this.state.amount, 10 ) }
							value={ this.state.processed }
						/>
						<p style={ { color: colors.$palette_grey_text } }>
							{ __( "Optimizing SEO data... This may take a while.", "wordpress-seo" ) }
						</p>
					</Fragment>
				}
				{
					this.state.error && <Alert type={ "error" }>
						{ __( "Oops, something has gone wrong and we couldn't complete the optimization of your SEO data. " +
							  "Please click the button again to re-start the process.", "wordpress-seo" ) }
					</Alert>
				}
				{
					this.state.inProgress
						? <button
							className="yoast-button yoast-button--secondary"
							type="button"
							onClick={ this.stopIndexing }
						>
							{ __( "Stop SEO data optimization", "wordpress-seo" ) }
						</button>
						: <button
							className="yoast-button yoast-button--primary"
							type="button"
							onClick={ this.startIndexing }
						>
							{ __( "Start SEO data optimization", "wordpress-seo" ) }
						</button>
				}
			</Fragment>
		);
	}
}

export default Indexation;
