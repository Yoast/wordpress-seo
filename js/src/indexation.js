/* global yoastIndexingData */
import styled from "styled-components";
import { render, Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ProgressBar } from "@yoast/components";
import { Button } from "@yoast/components/src/button/Button";
import { Alert } from "@yoast/components";
import { colors } from "@yoast/style-guide";

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
class Indexation extends Component {
	/**
	 * Indexation constructor.
	 *
	 * @param {Object} props The properties.
	 */
	constructor( props ) {
		super( props );

		this.settings = yoastIndexingData;
		this.stoppedIndexation = false;

		this.state = {
			started: false,
			processed: 0,
			amount: this.settings.amount,
			error: null,
		};

		this.startIndexation = this.startIndexation.bind( this );
		this.stopIndexation = this.stopIndexation.bind( this );
	}

	/**
	 * Does an indexation request.
	 *
	 * @param {string} url   The url of the indexation that should be done.
	 * @param {string} nonce The WordPress nonce value for in the header.
	 *
	 * @returns {Promise} The request promise.
	 */
	async doIndexationRequest( url, nonce ) {
		const response = await fetch( url, {
			method: "POST",
			headers: {
				"X-WP-Nonce": nonce,
			},
		} );
		return response.json();
	}

	/**
	 * Does the indexation of a given endpoint.
	 *
	 * @param {string} endpoint The endpoint.
	 *
	 * @returns {Promise} The indexation promise.
	 */
	async doIndexation( endpoint ) {
		let url = this.settings.restApi.root + this.settings.restApi.endpoints[ endpoint ];

		while ( this.state.started && url !== false && this.state.processed <= this.state.amount ) {
			try {
				const response = await this.doIndexationRequest( url, this.settings.restApi.nonce );
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
	 * Starts the indexation process.
	 *
	 * @returns {Promise} The start indexation promise.
	 */
	async startIndexation() {
		this.setState( { processed: 0, started: true, error: null } );
		for ( const endpoint of Object.keys( this.settings.restApi.endpoints ) ) {
			await this.doIndexation( endpoint );
		}
	}

	/**
	 * Stops the indexation process.
	 *
	 * @returns {void}
	 */
	stopIndexation() {
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
							max={ this.state.amount }
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
						? <Button onClick={ this.stopIndexation } variant="grey">
							{ __( "Stop SEO data optimization", "wordpress-seo" ) }
						</Button>
						: <Button onClick={ this.startIndexation } variant="purple">
							{ __( "Start SEO data optimization", "wordpress-seo" ) }
						</Button>
				}
			</Fragment>
		);
	}
}

render( <Indexation />, document.getElementById( "yoast-seo-indexation-action" ) );
