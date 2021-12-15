/* global wpseoAdminGlobalL10n */

/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmpty, filter, debounce } from "lodash-es";
import styled from "styled-components";

/* Yoast dependencies */
import { getDirectionalStyle, makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import WincherTableRow from "./WincherTableRow";
import {
	getAccountLimits,
	getKeyphrases,
	handleAPIResponse,
	trackKeyphrases,
	untrackKeyphrase,
} from "../helpers/wincherEndpoints";

const GetMoreInsightsLink = makeOutboundLink();

const FocusKeyphraseFootnote = styled.span`
	display: block;
	font-style: italic;

	@media (min-width: 782px) {
		display: inline;
		position: absolute;
		${ getDirectionalStyle( "right", "left" ) }: 8px;
	}
`;

const ViewColumn = styled.th`
	min-width: 60px;
`;

const TableWrapper = styled.div`
	width: 100%;
	overflow-y: auto;
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

		this.onTrackKeyphrase     = this.onTrackKeyphrase.bind( this );
		this.onUntrackKeyphrase   = this.onUntrackKeyphrase.bind( this );
		// This is debounced since the permalink might change rapidly when typing.
		this.getTrackedKeyphrases = debounce( this.getTrackedKeyphrases, 500, {
			leading: true,
		} ).bind( this );

		this.interval = null;
		this.hasFetchedKeyphrasesAfterConnect = false;
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
			setKeyphraseLimitReached,
			addTrackedKeyphrase,
			setRequestSucceeded,
			setRequestFailed,
			removeTrackedKeyphrase,
		} = this.props;

		const keyphrasesArray = Array.isArray( keyphrases ) ? keyphrases : [ keyphrases ];

		// Add the keyphrases already for instant UX. Will be removed again if the request fails or the limit is reached.
		keyphrasesArray.map( k => addTrackedKeyphrase( {
			[ k.toLowerCase() ]: { keyword: k },
		} ) );

		const trackLimits = await getAccountLimits();

		if ( trackLimits.status === 200 && ! trackLimits.canTrack ) {
			keyphrasesArray.map( k => removeTrackedKeyphrase( k ) );
			setKeyphraseLimitReached( trackLimits.limit );

			return;
		}

		await handleAPIResponse(
			() => trackKeyphrases( keyphrases ),
			async( response ) => {
				setRequestSucceeded( response );
				addTrackedKeyphrase( response.results );
				await this.getTrackedKeyphrases( Object.keys( this.props.trackedKeyphrases ) );
			},
			async( response ) => {
				setRequestFailed( response );
				keyphrasesArray.map( k => removeTrackedKeyphrase( k ) );
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
		const { newRequest } = this.props;

		// Prepare a new request.
		newRequest();

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
		const {
			setRequestSucceeded,
			removeTrackedKeyphrase,
			addTrackedKeyphrase,
			setRequestFailed,
		} = this.props;

		keyphrase = keyphrase.toLowerCase();
		const oldData = this.getKeyphraseData( keyphrase );
		removeTrackedKeyphrase( keyphrase );

		await handleAPIResponse(
			() => untrackKeyphrase( keyphraseID ),
			( response ) => {
				setRequestSucceeded( response );
				removeTrackedKeyphrase( keyphrase );
			},
			async( response ) => {
				setRequestFailed( response );
				addTrackedKeyphrase( { [ keyphrase ]: oldData } );
			}
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
		const {
			setRequestSucceeded,
			setTrackedKeyphrases,
			setRequestFailed,
			permalink,
		} = this.props;

		await handleAPIResponse(
			() => getKeyphrases( keyphrases, permalink ),
			async( response ) => {
				setRequestSucceeded( response );
				setTrackedKeyphrases( response.results );

				if ( isEmpty( response.results ) ) {
					clearInterval( this.interval );
					return;
				}
			},
			async( response ) => {
				setRequestFailed( response );
			}
		);
	}

	/**
	 * Determines whether there are any tracked keyphrases that still miss
	 * ranking data completely.
	 *
	 * @returns {boolean} Whether there are some keyphrases missing ranking data.
	 */
	someKeyphrasesHaveNoRankingData() {
		const { trackedKeyphrases } = this.props;

		if ( isEmpty( trackedKeyphrases ) ) {
			return false;
		}

		return filter( trackedKeyphrases, ( trackedKeyphrase ) => {
			return isEmpty( trackedKeyphrase.updated_at );
		} ).length > 0;
	}

	/**
	 * Loads tracking data when the table is mounted in the DOM.
	 *
	 * @returns {void}
	 */
	async componentDidMount() {
		const { trackAll, isLoggedIn, keyphrases, permalink } = this.props;

		if ( ! isLoggedIn ) {
			return;
		}

		if ( trackAll ) {
			await this.performTrackingRequest( keyphrases );

			return;
		}

		if ( permalink ) {
			this.interval = setInterval( async() => {
				await this.getTrackedKeyphrases( keyphrases );
			}, 10000 );

			await this.getTrackedKeyphrases( keyphrases );
		}
	}

	/**
	 * Sets up the interval that refreshes the data when some keyphrases are
	 * missing ranking data.
	 *
	 * @returns {void}
	 */
	setupInterval() {
		const { keyphrases } = this.props;

		clearInterval( this.interval );
		if ( this.someKeyphrasesHaveNoRankingData() ) {
			this.interval = setInterval( async() => {
				await this.getTrackedKeyphrases( keyphrases );
			}, 10000 );
		}
	}

	/**
	 * Fetches keyword data if necessary according to the current state.
	 *
	 * @param {Object} prevProps The previous props.
	 *
	 * @returns {void}
	 */
	fetchKeyphraseDataIfNeeded( prevProps ) {
		const {
			keyphrases,
			isNewlyAuthenticated,
			permalink,
		} = this.props;

		// Re-fetch data when the permalink changes
		if ( permalink && prevProps.permalink !== permalink ) {
			this.getTrackedKeyphrases( keyphrases );
		}

		// Fetch data after authentication
		if ( isNewlyAuthenticated && ! this.hasFetchedKeyphrasesAfterConnect ) {
			this.getTrackedKeyphrases( keyphrases );
			this.hasFetchedKeyphrasesAfterConnect = true;
		}
	}

	/**
	 * Re-fetches data in certain cases and resets the interval.
	 *
	 * @param {Object} prevProps The previous props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		const { isLoggedIn } = this.props;

		if ( ! isLoggedIn ) {
			return;
		}

		this.fetchKeyphraseDataIfNeeded( prevProps );
		this.setupInterval();
	}

	/**
	 * Unsets the polling when the modal is closed.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		clearInterval( this.interval );
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
	 * Renders the table.
	 *
	 * @returns {React.Element} The table.
	 */
	render() {
		const {
			websiteId,
			keyphrases,
			isLoggedIn,
			trackedKeyphrases,
			focusKeyphrase,
		} = this.props;

		const isLoading = isLoggedIn && trackedKeyphrases === null;
		const isDisabled = ! isLoggedIn;

		return (
			keyphrases && ! isEmpty( keyphrases ) && <Fragment>
				<TableWrapper>
					<table className="yoast yoast-table">
						<thead>
							<tr>
								<th
									scope="col"
									abbr={ __( "Tracking", "wordpress-seo" ) }
								>
									{ __( "Tracking", "wordpress-seo" ) }
								</th>
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
								<ViewColumn className="yoast-table--nobreak" />
							</tr>
						</thead>
						<tbody>
							{
								keyphrases.map( ( keyphrase, index ) => {
									return ( <WincherTableRow
										key={ `trackable-keyphrase-${index}` }
										keyphrase={ keyphrase }
										onTrackKeyphrase={ this.onTrackKeyphrase }
										onUntrackKeyphrase={ this.onUntrackKeyphrase }
										rowData={ this.getKeyphraseData( keyphrase ) }
										isFocusKeyphrase={ keyphrase === focusKeyphrase.trim() }
										websiteId={ websiteId }
										isDisabled={ isDisabled }
										isLoading={ isLoading }
									/> );
								} )
							}
						</tbody>
					</table>
				</TableWrapper>
				<p style={ { marginBottom: 0, position: "relative" } }>
					<GetMoreInsightsLink
						href={ wpseoAdminGlobalL10n[ "links.wincher.login" ] }
					>
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
	addTrackedKeyphrase: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool,
	isNewlyAuthenticated: PropTypes.bool,
	keyphrases: PropTypes.array,
	newRequest: PropTypes.func.isRequired,
	removeTrackedKeyphrase: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	setKeyphraseLimitReached: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setTrackedKeyphrases: PropTypes.func.isRequired,
	trackAll: PropTypes.bool,
	trackedKeyphrases: PropTypes.object,
	websiteId: PropTypes.string,
	permalink: PropTypes.string.isRequired,
	focusKeyphrase: PropTypes.string,
};

WincherKeyphrasesTable.defaultProps = {
	isLoggedIn: false,
	isNewlyAuthenticated: false,
	keyphrases: [],
	trackAll: false,
	trackedKeyphrases: {},
	websiteId: "",
	focusKeyphrase: "",
};

export default WincherKeyphrasesTable;
