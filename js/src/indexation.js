/* global jQuery, yoastIndexingData */
import { render, Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ProgressBar } from "@yoast/components";
import { Button } from "@yoast/components/src/button/Button";
import { Alert } from "@yoast/components";
import { colors } from "@yoast/style-guide";

const preIndexingActions = {};
const IndexingActions = {};

window.yoast = window.yoast || {};
window.yoast.indexing = window.yoast.indexing || {};

/**
 * Registers a pre-indexing action on the given indexing endpoint.
 *
 * This action is executed before the endpoint is first called with the indexing
 * settings as its first argument.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerPreIndexingAction = ( endpoint, action ) => {
	preIndexingActions[ endpoint ] = action;
};

/**
 * Registers an action on the given indexing endpoint.
 *
 * This action is executed each time after the endpoint is called, with the objects
 * returned from the endpoint as its first argument and the indexing settings as its second argument.
 *
 * @param {string}                       endpoint The endpoint on which to register the action.
 * @param {function(Object[], Object[])} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerIndexingAction = ( endpoint, action ) => {
	IndexingActions[ endpoint ] = action;
};

/**
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing` instead.
 */
window.yoast.indexation = window.yoast.indexing;

/**
 * Registers a pre-indexing action on the given indexing endpoint.
 *
 * This action is executed before the endpoint is first called with the indexing
 * settings as its first argument.
 *
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing.registerPreIndexingAction` instead.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexation.registerPreIndexationAction = ( endpoint, action ) => {
	console.warn( "Deprecated since 15.1. Use 'window.yoast.indexing.registerPreIndexingAction' instead." );
	window.yoast.indexing.registerPreIndexingAction( endpoint, action );
};

/**
 * Registers an action on the given indexing endpoint.
 *
 * This action is executed each time after the endpoint is called, with the objects
 * returned from the endpoint as its first argument and the indexing settings as its second argument.
 *
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing.registerIndexingAction` instead.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function(Object[], Object[])} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexation.registerIndexationAction = ( endpoint, action ) => {
	console.warn( "Deprecated since 15.1. Use 'window.yoast.indexing.registerIndexingAction' instead." );
	window.yoast.indexing.registerIndexingAction( endpoint, action );
};

/**
 * Indexes the site and shows a progress bar indicating the indexing process' progress.
 */
class Indexing extends Component {
	/**
	 * Indexing constructor.
	 *
	 * @param {Object} props The properties.
	 */
	constructor( props ) {
		super( props );

		this.settings = yoastIndexingData;
		this.stoppedIndexing = false;

		this.state = {
			inProgress: false,
			processed: 0,
			amount: this.settings.amount,
			error: null,
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
	 * Do any registered indexing action *before* a call to an index endpoint.
	 *
	 * @param {string} endpoint The endpoint that has been called.
	 *
	 * @returns {Promise<void>} An empty promise.
	 */
	async doPreIndexingAction( endpoint ) {
		if ( typeof preIndexingActions[ endpoint ] === "function" ) {
			await preIndexingActions[ endpoint ]( this.settings );
		}
	}

	/**
	 * Do any registered indexing action *after* a call to an index endpoint.
	 *
	 * @param {string} endpoint The endpoint that has been called.
	 * @param {Object} response The response of the call to the endpoint.
	 *
	 * @returns {Promise<void>} An empty promise.
	 */
	async doPostIndexingAction( endpoint, response ) {
		if ( typeof IndexingActions[ endpoint ] === "function" ) {
			await IndexingActions[ endpoint ]( response.objects, this.settings );
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
	 * Starts the indexing process.
	 *
	 * @returns {Promise} The start indexing promise.
	 */
	async startIndexing() {
		this.setState( { processed: 0, inProgress: true, error: null } );
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
	 * Renders the component
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	render() {
		if ( this.settings.disabled ) {
			return <Fragment>
				<p>
					<Button disabled={ true } variant="grey">
						{ __( "Start SEO data optimization", "wordpress-seo" ) }
					</Button>
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
						? <Button onClick={ this.stopIndexing } variant="grey">
							{ __( "Stop SEO data optimization", "wordpress-seo" ) }
						</Button>
						: <Button onClick={ this.startIndexing } variant="purple">
							{ __( "Start SEO data optimization", "wordpress-seo" ) }
						</Button>
				}
			</Fragment>
		);
	}
}

jQuery( document ).ready( function() {
	const root = document.getElementById( "yoast-seo-indexing-action" );
	if ( root ) {
		render( <Indexing />, root );
	}
} );
