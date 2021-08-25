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
		const url    = "https://auth.wincher.com/connect/authorize?client_id=yoast&response_type=code&" +
			"redirect_uri=https%3A%2F%2Fauth.wincher.com%2Fyoast%2Fsetup&scope=api%20offline_access";
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
	 * @param {Object} data The message data.
	 *
	 * @returns {void}
	 */
	async performAuthenticationRequest( data ) {
		const { code, websiteId } = data;
		const {
			onAuthentication,
			setRequestSucceeded,
			keyphrases,
			lastRequestKeyphrase,
		} = this.props;

		await this.callEndpoint(
			{
				path: "yoast/v1/wincher/authenticate",
				method: "POST",
				data: { code, websiteId },
			},
			async( response ) => {
				onAuthentication( true, true );
				setRequestSucceeded( response );

				// Collect all data known to Wincher first.
				await this.getTrackedKeyphrases( keyphrases );
				await this.performTrackingRequest( lastRequestKeyphrase );

				// Close the popup if it's been opened again by mistake.
				this.popup.close();
			}
		);
	}

	/**
	 * Gets the currently set limit information associated with the connected Wincher account.
	 *
	 * @returns {Object} The account limits.
	 */
	async getAccountLimits() {
		return await this.callEndpoint(
			{
				path: "yoast/v1/wincher/limits",
				method: "GET",
			},
			( response ) => {
				return { ...response };
			}
		);
	}

	/**
	 * Performs the tracking request for one or more keyphrases.
	 *
	 * @param {Array|string} keyphrases The keyphrase(s) to track.
	 *
	 * @returns {void}
	 */
	async performTrackingRequest( keyphrases ) {
		const {
			setRequestLimitReached,
			addTrackingKeyphrase,
			setRequestSucceeded,
		} = this.props;
		const trackLimits = await this.getAccountLimits();

		if ( ! trackLimits.canTrack ) {
			setRequestLimitReached( trackLimits.limit );

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
			async( response ) => {
				setRequestSucceeded( response );
				addTrackingKeyphrase( response.results );

				// Get the chart data.
				await this.getTrackedKeyphrasesChartData( keyphrases );
			},
			201
		);
	}

	/**
	 * Fires when a keyphrase is set to be tracked.
	 *
	 * @param {string} keyphrase The keyphrase to track.
	 *
	 * @returns {void}
	 */
	async onTrackKeyphrase( keyphrase ) {
		const { newRequest, isLoggedIn } = this.props;

		// Prepare a new request.
		newRequest( keyphrase );

		if ( ! isLoggedIn ) {
			this.onLoginOpen();

			return;
		}

		await this.performTrackingRequest( keyphrase );
	}

	/**
	 * Fires when a keyphrase is set to be untracked.
	 *
	 * @param {string} keyphrase The keyphrase to untrack.
	 * @param {string} keyphraseID The keyphrase ID to untrack.
	 *
	 * @returns {void}
	 */
	async onUntrackKeyphrase( keyphrase, keyphraseID ) {
		const { setRequestSucceeded, removeTrackingKeyphrase } = this.props;

		await this.callEndpoint(
			{
				path: "yoast/v1/wincher/keyphrases/untrack",
				method: "DELETE",
				data: { keyphraseID },
			},
			( response ) => {
				setRequestSucceeded( response );
				removeTrackingKeyphrase( keyphrase.toLowerCase() );
			},
			204
		);
	}

	/**
	 * Gets the tracked keyphrases.
	 *
	 * @param {Array} keyphrases The keyphrases used in the post.
	 *
	 * @returns {void}
	 */
	 async getTrackedKeyphrases( keyphrases ) {
		const { setRequestSucceeded, setTrackingKeyphrases } = this.props;
		const preparedKeyphrases = encodeURIComponent( JSON.stringify( keyphrases ) );

		await this.callEndpoint( {
			path: addQueryArgs(
				"yoast/v1/wincher/keyphrases",
				{
					keyphrases: preparedKeyphrases,
				}
			),
			method: "GET",
		},
		async( response ) => {
			setRequestSucceeded( response );
			setTrackingKeyphrases( response.results );

			// Get the chart data.
			await this.getTrackedKeyphrasesChartData( keyphrases );
		} );
	}

	/**
	 * Gets the chart data for the tracked keyphrases.
	 *
	 * @param {Array} keyphrases The keyphrases used in the post.
	 *
	 * @returns {void}
	 */
	async getTrackedKeyphrasesChartData( keyphrases ) {
		const {
			setPendingChartRequest,
			setRequestSucceeded,
			setTrackingCharts,
		} = this.props;

		const preparedKeyphrases = encodeURIComponent( JSON.stringify( keyphrases ) );

		setPendingChartRequest( true );

		await this.callEndpoint( {
			path: addQueryArgs(
				"yoast/v1/wincher/keyphrases/chart",
				{
					keyphrases: preparedKeyphrases,
				}
			),
			method: "GET",
		},
		async( response ) => {
			setRequestSucceeded( response );
			setTrackingCharts( response.results );

			if  ( this.allKeyphrasesHavePositionData() ) {
				setPendingChartRequest( false );
			}
		} );
	}

	/**
	 * Determines whether the amount of tracked keyphrases and the chart data, are equal.
	 *
	 * @returns {boolean} Whether there are equal amounts of chart data available.
	 */
	allKeyphrasesHavePositionData() {
		const { trackedKeyphrasesChartData, trackedKeyphrases } = this.props;

		return Object.keys( trackedKeyphrasesChartData ).length === Object.keys( trackedKeyphrases ).length;
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
	 * @returns {void}
	 */
	async componentDidMount() {
		const { trackAll, isLoggedIn, keyphrases } = this.props;

		if ( trackAll ) {
			await this.performTrackingRequest( keyphrases );

			return;
		}

		if ( isLoggedIn ) {
			await this.getTrackedKeyphrases( keyphrases );
		}
	}

	/**
	 * Gets the passed keyphrase from the tracked keyphrases data object.
	 *
	 * @param {string} keyphrase The keyphrase to search for.
	 *
	 * @returns {Object|null} The keyphrase object. Returns null if it can't be found.
	 */
	getKeyphraseData( keyphrase ) {
		const { trackedKeyphrases } = this.props;
		const targetKeyphrase = keyphrase.toLowerCase();

		if ( trackedKeyphrases && ! isEmpty( trackedKeyphrases ) && trackedKeyphrases.hasOwnProperty( targetKeyphrase ) ) {
			return trackedKeyphrases[ targetKeyphrase ];
		}

		return null;
	}

	/**
	 * Gets the passed keyphrase from the tracked keyphrases data object.
	 *
	 * @param {string} keyphrase The keyphrase to search for.
	 *
	 * @returns {Object|null} The keyphrase object. Returns null if it can't be found.
	 */
	getKeyphraseChartData( keyphrase ) {
		const { trackedKeyphrasesChartData } = this.props;
		const targetKeyphrase = keyphrase.toLowerCase();

		if ( trackedKeyphrasesChartData && ! isEmpty( trackedKeyphrasesChartData ) && trackedKeyphrasesChartData.hasOwnProperty( targetKeyphrase ) ) {
			return trackedKeyphrasesChartData[ targetKeyphrase ];
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
			websiteId,
		} = this.props;

		const keyphrases = this.props.keyphrases;

		// TODO: Remove this after completion.
		keyphrases.push( "SEO rank tracker" );
		keyphrases.push( "seo ranking tracking" );

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
									rowData={ this.getKeyphraseData( keyphrase ) }
									chartData={ this.getKeyphraseChartData( keyphrase ) }
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
	keyphrases: PropTypes.array,
	trackedKeyphrases: PropTypes.object,
	trackedKeyphrasesChartData: PropTypes.object,
	allowToggling: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
	trackAll: PropTypes.bool,
	newRequest: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestLimitReached: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	onAuthentication: PropTypes.func.isRequired,
	addTrackingKeyphrase: PropTypes.func.isRequired,
	setPendingChartRequest: PropTypes.func.isRequired,
	setTrackingCharts: PropTypes.func.isRequired,
	removeTrackingKeyphrase: PropTypes.func.isRequired,
	setTrackingKeyphrases: PropTypes.func.isRequired,
	websiteId: PropTypes.number,
	lastRequestKeyphrase: PropTypes.string,
};

WincherKeyphrasesTable.defaultProps = {
	keyphrases: [],
	trackedKeyphrases: {},
	trackedKeyphrasesChartData: {},
	allowToggling: true,
	isLoggedIn: false,
	trackAll: false,
	websiteId: 0,
	lastRequestKeyphrase: "",
};

export default WincherKeyphrasesTable;
