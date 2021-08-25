/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmpty, isArray } from "lodash-es";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import styled from "styled-components";

/* Yoast dependencies */
import { getDirectionalStyle, makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import WincherTableRow from "./WincherTableRow";

const GetMoreInsightsLink = makeOutboundLink();

const FocusKeyphraseFootnote = styled.span`
	position: absolute;
	${ getDirectionalStyle( "right", "left" ) }: 8px;
	font-style: italic;
`;

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

		this.onLoginOpen          = this.onLoginOpen.bind( this );
		this.listenToMessages     = this.listenToMessages.bind( this );
		this.onTrackKeyphrase     = this.onTrackKeyphrase.bind( this );
		this.onUntrackKeyphrase   = this.onUntrackKeyphrase.bind( this );
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
				path: "yoast/v1/wincher/limits",
				method: "GET",
			},
			( response ) => {
				// Set the user limits.


				return { ...response };
			}
		);
	}

	async performTrackingRequest( keyphrases ) {
		const trackLimits = await this.performLimitCheckRequest();

		if ( ! trackLimits.canTrack ) {
			this.props.setRequestLimitReached( trackLimits.limit );

			return;
		}

		if ( ! isArray( keyphrases ) ) {
			keyphrases = [ keyphrases ];
		}

		await this.callEndpoint(
			{
				path: "yoast/v1/wincher/keyphrases/track",
				method: "POST",
				data: { keyphrases },
			},
			( response ) => {
				this.props.setRequestSucceeded( response );
				this.props.addTrackingKeyphrase( response.results );
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

		await this.performTrackingRequest( keyphrase );
	}

	async onUntrackKeyphrase( keyphrase, keyphraseID ) {
		this.props.newRequest( keyphrase );

		await this.callEndpoint(
			{
				path: "yoast/v1/wincher/keyphrases/untrack",
				method: "DELETE",
				data: { keyphraseID },
			},
			( response ) => {
				this.props.setRequestSucceeded( response );
				this.props.removeTrackingKeyphrase( keyphrase.toLowerCase() );
			},
			204
		);
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
			this.props.setTrackingKeyphrases( response.results );

			// Get the chart data.
			await this.getTrackedKeyphrasesChartData( keyphrases );
		} );
	}

	async getTrackedKeyphrasesChartData( keyphrases ) {
		const preparedKeyphrases = encodeURIComponent( JSON.stringify( keyphrases ) );

		await this.callEndpoint( {
			path: addQueryArgs(
				"yoast/v1/wincher/keyphrases/chart",
				{
					keyphrases: preparedKeyphrases,
				}
			),
			method: "GET",
		},
		async ( response ) => {
			console.log( response );
			// this.props.setRequestSucceeded( response );
		} );
	}

	/**
	 * Calls the passed endpoint and handles any potential errors.
	 *
	 * @param {Object}   endpoint     The endpoint object.
	 * @param {Function} callback     The callback function to call on a successful API call.
	 * @param {int}      expectedCode The expected reponse code to trigger the callback method on. Defaults to 200.
	 *
	 * @returns {Promise} The API response promise.
	 */
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

	/**
	 * Loads tracking data when the table is mounted in the DOM.
	 *
	 * @returns {Promise<void>} The tracked keyphrases API call.
	 */
	async componentDidMount() {
		if ( this.props.trackAll ) {
			await this.performTrackingRequest( this.props.keyphrases );

			return;
		}

		if ( this.props.isLoggedIn ) {
			await this.getTrackedKeyphrases( this.props.keyphrases );
		}
	}

	/**
	 * Gets the passed keyphrase from the response data object.
	 *
	 * @param {string} keyphrase The keyphrase to search for.
	 *
	 * @returns {Object|null} The keyphrase object. Returns null if it can't be found.
	 */
	getKeyphraseDataFromResponse( keyphrase ) {
		const { trackedKeyphrases } = this.props;
		const targetKeyphrase = keyphrase.toLowerCase();

		if ( trackedKeyphrases && ! isEmpty( trackedKeyphrases ) && trackedKeyphrases.hasOwnProperty( targetKeyphrase ) ) {
			return trackedKeyphrases[ targetKeyphrase ];
		}

		return null;
	}

	/**
	 * Renders the table.
	 *
	 * @returns {React.Element} The table.
	 */
	render() {
		const {
			allowToggling,
			isPending,
			websiteId,
		} = this.props;

		let keyphrases = this.props.keyphrases;

		// TODO: Remove this after completion.
		keyphrases.push("SEO rank tracker");
		keyphrases.push("seo ranking tracking");

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
									onUntrackKeyphrase={ this.onUntrackKeyphrase }
									rowData={ this.getKeyphraseDataFromResponse( keyphrase ) }
									isPending={ isPending }
									isFocusKeyphrase={ index === 0 }
									websiteId={ websiteId }
								/> );
							} )
						}
					</tbody>
				</table>
				<p style={ { marginBottom: 0, position: "relative" } }>
					<GetMoreInsightsLink href={ "https://google.com" }>
						{ sprintf(
							/* translators: %s expands to Wincher */
							__( "Get more insights over at %s", "wordpress-seo" ),
							"Wincher"
						) }
					</GetMoreInsightsLink>
					<FocusKeyphraseFootnote>
						{ __( "* focus keyphrase", "wordpress-seo" ) }
					</FocusKeyphraseFootnote>
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
