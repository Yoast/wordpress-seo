/* global jQuery, yoastIndexingData */
import styled from "styled-components";
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
window.yoast.indexing.registerPreIndexingAction = ( endpoint, action ) => {
	preIndexingActions[ endpoint ] = action;
};
window.yoast.indexing.registerIndexingAction = ( endpoint, action ) => {
	IndexingActions[ endpoint ] = action;
};

const Progress = styled( ProgressBar )`
	height: 16px;
	margin: 8px 0;
`;

const Text = styled.p`
	color: ${ colors.$palette_grey_text }
`;

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
			started: false,
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
	 * Does the indexing of a given endpoint.
	 *
	 * @param {string} endpoint The endpoint.
	 *
	 * @returns {Promise} The indexing promise.
	 */
	async doIndexing( endpoint ) {
		let url = this.settings.restApi.root + this.settings.restApi.endpoints[ endpoint ];

		while ( this.state.started && url !== false && this.state.processed <= this.state.amount ) {
			try {
				if ( typeof preIndexingActions[ endpoint ] === "function" ) {
					await preIndexingActions[ endpoint ]( this.settings );
				}

				const response = await this.doIndexingRequest( url, this.settings.restApi.nonce );

				if ( typeof IndexingActions[ endpoint ] === "function" ) {
					await IndexingActions[ endpoint ]( response.objects, this.settings );
				}

				this.setState( previousState => (
					{ processed: previousState.processed + response.objects.length }
				) );

				url = response.next_url;
			} catch ( error ) {
				this.setState( { started: false, error } );
			}
		}
	}

	/**
	 * Starts the indexing process.
	 *
	 * @returns {Promise} The start indexing promise.
	 */
	async startIndexing() {
		this.setState( { processed: 0, started: true, error: null } );
		for ( const endpoint of Object.keys( this.settings.restApi.endpoints ) ) {
			await this.doIndexing( endpoint );
		}
		// Set the progress bar to 100% after completing the indexing process.
		this.setState( previousState => (
			{ processed: previousState.amount }
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
				started: false,
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
		if ( this.state.processed >= this.state.amount ) {
			return <Alert type={ "success" }>{ __( "SEO data optimization complete", "wordpress-seo" ) }</Alert>;
		}

		return (
			<Fragment>
				{
					this.state.started && <Fragment>
						<Progress
							progressColor={ colors.$color_pink_dark }
							max={ parseInt( this.state.amount, 10 ) }
							value={ this.state.processed }
						/>
						<Text>{ __( "Optimizing SEO data... This may take a while.", "wordpress-seo" ) }</Text>
					</Fragment>
				}
				{
					this.state.error && <Alert type={ "error" }>
						{ __( "Oops, something has gone wrong and we couldn't complete the optimization of your SEO data. " +
							  "Please click the button again to re-start the process.", "wordpress-seo" ) }
					</Alert>
				}
				{
					this.state.started
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
