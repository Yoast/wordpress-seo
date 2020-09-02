/* global yoastIndexingData */
import styled from "styled-components";
import { render, Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ProgressBar } from "@yoast/components";
import { Button } from "@yoast/components/src/button/Button";
import { colors } from "@yoast/style-guide";

const Progress = styled( ProgressBar )`
	height: 16px;
	max-width: 600px;
	margin: 8px 0;
`;

const Text = styled.p`
	color: ${colors.$palette_grey_text}
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

		while ( this.state.started && url !== false && this.state.processed <= this.settings.amount ) {
			const response = await this.doIndexationRequest( url, this.settings.restApi.nonce );
			this.setState( previousState => (
				{ processed: previousState.processed + response.objects.length }
			) );
			url = response.next_url;
		}
	}

	/**
	 * Starts the indexation process.
	 *
	 * @returns {Promise} The start indexation promise.
	 */
	async startIndexation() {
		this.setState( { processed: 0, started: true } );
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
		this.setState( { started: false } );
		window.location.reload();
	}

	/**
	 * Renders the applicable component when the indexation has not started yet.
	 * (start button).
	 *
	 * @returns {JSX.Element} The applicable components.
	 */
	renderStartComponents() {
		return <Button onClick={ this.startIndexation } variant="purple">
			{ __( "Start SEO data optimization", "wordpress-seo" ) }
		</Button>;
	}

	/**
	 * Renders the applicable components when the indexation is in progress.
	 * (progress bar, stop button).
	 *
	 * @returns {JSX.Element} The applicable components.
	 */
	renderInProgressComponents() {
		return (
			<Fragment>
				<Progress
					progressColor={ colors.$color_pink_dark }
					max={ this.settings.amount }
					value={ this.state.processed }
				/>
				<Text>Optimizing SEO data... This may take a while.</Text>
				<Button onClick={ this.stopIndexation } variant="grey">
					{ __( "Stop SEO data optimization", "wordpress-seo" ) }
				</Button>
			</Fragment>
		);
	}

	/**
	 * Renders the component
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	render() {
		return this.state.started ? this.renderInProgressComponents() : this.renderStartComponents();
	}
}

render( <Indexation />, document.getElementById( "yoast-seo-indexation-action" ) );
