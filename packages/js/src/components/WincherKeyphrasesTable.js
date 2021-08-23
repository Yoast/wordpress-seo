/* External dependencies */
import PropTypes from "prop-types";
import {Fragment, Component, useCallback, useEffect} from "@wordpress/element";
import { __, sprintf, _n } from "@wordpress/i18n";
import { isEmpty, map, without } from "lodash-es";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import WincherTableRow from "./WincherTableRow";

const GetMoreInsightsLink = makeOutboundLink();

/**
 * The WincherKeyphrasesTable component.
 */
class WincherKeyphrasesTable extends Component {
	/**
	 * Constructs the Related Keyphrases table.
	 *
	 * @param {Object} props The props for the Related Keyphrases table.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onLoginOpen      = this.onLoginOpen.bind( this );
		this.listenToMessages = this.listenToMessages.bind( this );
		this.onTrackKeyphrase = this.onTrackKeyphrase.bind( this );
		this.getTrackedKeyphrases = this.getTrackedKeyphrases.bind( this );
	}

	/**
	 * Opens the popup window.
	 *
	 * @returns {void}
	 */
	onLoginOpen() {
		const url    = "https://auth.wincher.com/connect/authorize?client_id=yoast&response_type=code&redirect_uri=https%3A%2F%2Fauth.wincher.com%2Fyoast%2Fsetup&scope=api%20offline_access";
		const height = "570";
		const width  = "340";
		const top    = window.top.outerHeight / 2 + window.top.screenY - ( height / 2 );
		const left   = window.top.outerWidth / 2 + window.top.screenX - ( width / 2 );

		const features = [
			"top=" + top,
			"left=" + left,
			"width=" + width,
			"height=" + height,
			"resizable=1",
			"scrollbars=1",
			"status=0",
		];

		if ( ! this.popup || this.popup.closed ) {
			this.popup = window.open( url, "Wincher_login", features.join( "," ) );
		}

		if ( this.popup ) {
			this.popup.focus();
		}

		window.addEventListener( "message", this.listenToMessages, false );
	}

	/**
	 * Listens to message events from the Wincher popup.
	 *
	 * @param {event} event The message event.
	 *
	 * @returns {void}
	 */
	async listenToMessages( event ) {
		const { data, source, origin } = event;

		// Check that the message comes from the expected origin.
		if ( origin !== "https://auth.wincher.com" || this.popup !== source ) {
			return;
		}

		if ( data.type === "wincher:oauth:success" ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.listenToMessages, false );
			await this.performAuthenticationRequest( data );
		}

		if ( data.type === "wincher:oauth:error" ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.listenToMessages, false );
			this.props.onAuthentication( false, false );
		}
	}

	/**
	 * Get the tokens using the provided code after user has granted authorization.
	 *
	 * @param {object} data The message data.
	 *
	 * @returns {void}
	 */
	async performAuthenticationRequest( data ) {
		const { code, websiteId } = data;

		await this.callEndpoint(
			{
				path: "yoast/v1/wincher/authenticate",
				method: "POST",
				data: { code, websiteId },
			},
			async ( response ) => {
				this.props.onAuthentication( true, true );

				// Collect all data known to Wincher first.
				await this.getTrackedKeyphrases( this.props.keyphrases );
				await this.performTrackingRequest( this.props.lastRequestKeyphrase );

				// Close the popup if it's been opened again by mistake.
				this.popup.close();
			}
		);
	}

	async performLimitCheckRequest() {
		return await this.callEndpoint(
			{
				path: "yoast/v1/wincher/limit/check",
				method: "GET",
			},
			( response ) => {
				// Set the user limits.


				return { ...response };
			}
		);
	}

	async performTrackingRequest( keyphrase ) {
		const trackLimits = await this.performLimitCheckRequest();

		if ( ! trackLimits.canTrack ) {
			this.props.setRequestLimitReached( trackLimits.limit );

			return;
		}

		await this.callEndpoint(
			{
				path: "yoast/v1/wincher/track/keyphrase/bulk",
				method: "POST",
				data: { keyphrase },
			},
			( response ) => {
				this.props.toggleKeyphraseTracking( keyphrase );
				this.props.setRequestSucceeded( response );
			},
			201
		);
	}

	async onTrackKeyphrase( keyphrase ) {
		// Prepare a new request.
		this.props.newRequest( keyphrase );

		if ( ! this.props.isLoggedIn ) {
			this.onLoginOpen();

			return;
		}

		// Toggle off

		await this.performTrackingRequest( keyphrase );
	}

	 async getTrackedKeyphrases( keyphrases ) {
		const preparedKeyphrases = encodeURIComponent( JSON.stringify( keyphrases ) );

		await this.callEndpoint( {
			path: addQueryArgs(
				"yoast/v1/wincher/keyphrases",
				{
					keyphrases: preparedKeyphrases,
					postID: window.wp.data.select( "core/editor" ).getCurrentPostId(),
				}
			),
			method: "GET",
		},
		async ( response ) => {
			this.props.setRequestSucceeded( response );
			this.props.setTrackingKeyphrases( response );

		} );
	}

	async callEndpoint( endpoint, callback, expectedCode = 200 ) {
		try {
			const response = await apiFetch( endpoint );

			if ( response.status === expectedCode ) {
				return callback( response );
			}

			this.props.setRequestFailed( response );
			console.error( response.error );
		} catch ( e ) {
			console.error( e.message );
		}
	}


	async componentDidMount() {
		if ( this.props.isLoggedIn ) {
			await this.getTrackedKeyphrases( this.props.keyphrases );
		}
	}

	getKeyphraseDataFromResponse( keyphrase ) {
		return ( this.props.response && ! isEmpty( this.props.response ) ) ? this.props.response.results.find( data => data.keyword === keyphrase.toLowerCase() ) : null;
	}

	/**
	 * Renders the table.
	 *
	 * @returns {React.Element} The table.
	 */
	render() {
		const {
			keyphrases,
			allowToggling,
		} = this.props;

		return (
			keyphrases && ! isEmpty( keyphrases ) && <Fragment>
				<table className="yoast yoast-table">
					<thead>
						<tr>
							{ allowToggling && <th
								scope="col"
								abbr={ __( "Tracking", "wordpress-seo" ) }
							>
								{ __( "Tracking", "wordpress-seo" ) }
							</th> }
							<th
								scope="col"
								abbr={ __( "Keyphrase", "wordpress-seo" ) }
							>
								{ __( "Keyphrase", "wordpress-seo" ) }
							</th>
							<th
								scope="col"
								abbr={ __( "Position", "wordpress-seo" ) }
							>
								{ __( "Position", "wordpress-seo" ) }
							</th>
							<th
								scope="col"
								abbr={ __( "Position over time", "wordpress-seo" ) }
							>
								{ __( "Position over time", "wordpress-seo" ) }
							</th>
							<td className="yoast-table--nobreak" />
						</tr>
					</thead>
					<tbody>
						{
							keyphrases.map( ( keyphrase, index ) => {
								return ( <WincherTableRow
									key={ `trackable-keyphrase-${index}` }
									keyphrase={ keyphrase }
									allowToggling={ allowToggling }
									onTrackKeyphrase={ this.onTrackKeyphrase }
									rowData={ this.getKeyphraseDataFromResponse( keyphrase ) }
								/> );
							} )
						}
					</tbody>
				</table>
				<p style={ { marginBottom: 0 } }>
					<GetMoreInsightsLink href={ "https://google.com" }>
						{ sprintf(
							/* translators: %s expands to Wincher */
							__( "Get more insights over at %s", "wordpress-seo" ),
							"Wincher"
						) }
					</GetMoreInsightsLink>
				</p>
			</Fragment>
		);
	}
}

WincherKeyphrasesTable.propTypes = {
	response: PropTypes.object,
	keyphrases: PropTypes.array,
	trackedKeyphrases: PropTypes.array,
	toggleAction: PropTypes.func,
	allowToggling: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
	newRequest: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestLimitReached: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	setNoResultsFound: PropTypes.func.isRequired,
	onAuthentication: PropTypes.func.isRequired,
	toggleKeyphraseTracking: PropTypes.func.isRequired,
};

WincherKeyphrasesTable.defaultProps = {
	response: {},
	keyphrases: [],
	trackedKeyphrases: [],
	toggleAction: null,
	allowToggling: true,
	isLoggedIn: false,
};

export default WincherKeyphrasesTable;
