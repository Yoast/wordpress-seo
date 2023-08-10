/* global wpseoAdminGlobalL10n */

/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, useRef, useState, useEffect, useCallback, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmpty, filter, debounce, without, difference, orderBy } from "lodash";
import styled from "styled-components";

/* Yoast dependencies */
import { getDirectionalStyle, makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import WincherTableRow from "./WincherTableRow";
import {
	getKeyphrases,
	trackKeyphrases,
	untrackKeyphrase,
} from "../helpers/wincherEndpoints";

import { handleAPIResponse } from "../helpers/api";
import { Checkbox } from "@yoast/components";

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

const TableWrapper = styled.div`
	width: 100%;
	overflow-y: auto;
`;

const SelectKeyphraseCheckboxWrapper = styled.th`
	pointer-events: ${ props => props.isDisabled ? "none" : "initial" };
	padding-right: 0 !important;

	& > div {
		margin: 0px;
	}
`;

const KeyphraseThWrapper = styled.th`
	padding-left: 2px !important;
`;

/**
 * Hook that returns the previous value.
 *
 * @param {*} value The current value.
 *
 * @returns {*} The previous value.
 */
const usePrevious = ( value ) => {
	const ref = useRef();
	useEffect( () => {
		ref.current = value;
	} );
	return ref.current;
};

const debouncedGetKeyphrases = debounce( getKeyphrases, 500, {
	leading: true,
} );

/**
 * The WincherKeyphrasesTable component.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The WincherKeyphrasesTable.
 *
 */
const WincherKeyphrasesTable = ( props ) => {
	const {
		addTrackedKeyphrase,
		isLoggedIn,
		keyphrases,
		permalink,
		removeTrackedKeyphrase,
		setKeyphraseLimitReached,
		setRequestFailed,
		setRequestSucceeded,
		setTrackedKeyphrases,
		setHasTrackedAll,
		trackAll,
		trackedKeyphrases,
		isNewlyAuthenticated,
		websiteId,
		focusKeyphrase,
		newRequest,
		startAt,
		selectedKeyphrases,
		onSelectKeyphrases,
	} = props;

	const interval = useRef();
	const abortController = useRef();
	const hasFetchedKeyphrasesAfterConnect = useRef( false );
	const [ loadingKeyphrases, setLoadingKeyphrases ] = useState( [] );

	/**
	 * Gets the passed keyphrase from the tracked keyphrases data object.
	 *
	 * @param {string} keyphrase The keyphrase to search for.
	 *
	 * @returns {Object|null} The keyphrase object. Returns null if it can't be found.
	 */
	const getKeyphraseData = useCallback( ( keyphrase ) => {
		const targetKeyphrase = keyphrase.toLowerCase();

		if ( trackedKeyphrases && ! isEmpty( trackedKeyphrases ) && trackedKeyphrases.hasOwnProperty( targetKeyphrase ) ) {
			return trackedKeyphrases[ targetKeyphrase ];
		}

		return null;
	}, [ trackedKeyphrases ] );

	/**
	 * Gets the tracked keyphrases.
	 *
	 * @returns {void}
	 */
	const getTrackedKeyphrases = useMemo( () => async() => {
		await handleAPIResponse(
			() => {
				// Ensure that we're not waiting for multiple of these requests at once.
				if ( abortController.current ) {
					abortController.current.abort();
				}
				abortController.current = typeof AbortController === "undefined" ? null : new AbortController();
				return debouncedGetKeyphrases( keyphrases, startAt, permalink, abortController.current.signal );
			},
			( response ) => {
				setRequestSucceeded( response );
				setTrackedKeyphrases( response.results );
			},
			( response ) => {
				setRequestFailed( response );
			}
		);
	}, [
		setRequestSucceeded,
		setRequestFailed,
		setTrackedKeyphrases,
		keyphrases,
		permalink,
		startAt,
	] );

	/**
	 * Performs the tracking request for one or more keyphrases.
	 *
	 * @param {Array|string} keyphrasesToTrack The keyphrase(s) to track.
	 *
	 * @returns {void}
	 */
	const performTrackingRequest = useCallback( async( keyphrasesToTrack ) => {
		const keyphrasesArray = ( Array.isArray( keyphrasesToTrack ) ? keyphrasesToTrack : [ keyphrasesToTrack ] )
			.map( k => k.toLowerCase() );

		setLoadingKeyphrases( curr => [ ...curr, ...keyphrasesArray ] );

		await handleAPIResponse(
			() => trackKeyphrases( keyphrasesArray ),
			( response ) => {
				setRequestSucceeded( response );
				addTrackedKeyphrase( response.results );
				getTrackedKeyphrases();
			},
			( response ) => {
				if ( response.status === 400 && response.limit ) {
					setKeyphraseLimitReached( response.limit );
				}
				setRequestFailed( response );
			},
			201
		);

		setLoadingKeyphrases( curr => without( curr, ...keyphrasesArray ) );
	}, [
		setRequestSucceeded,
		setRequestFailed,
		setKeyphraseLimitReached,
		addTrackedKeyphrase,
		getTrackedKeyphrases,
	] );

	/**
	 * Fires when a keyphrase is set to be untracked.
	 *
	 * @param {string} keyphrase The keyphrase to untrack.
	 * @param {string} keyphraseID The keyphrase ID to untrack.
	 *
	 * @returns {void}
	 */
	const onUntrackKeyphrase = useCallback( async( keyphrase, keyphraseID ) => {
		keyphrase = keyphrase.toLowerCase();

		setLoadingKeyphrases( curr => [ ...curr, keyphrase ] );

		await handleAPIResponse(
			() => untrackKeyphrase( keyphraseID ),
			( response ) => {
				setRequestSucceeded( response );
				removeTrackedKeyphrase( keyphrase );
			},
			( response ) => {
				setRequestFailed( response );
			}
		);

		setLoadingKeyphrases( curr => without( curr, keyphrase ) );
	}, [
		setRequestSucceeded,
		removeTrackedKeyphrase,
		setRequestFailed,
	] );

	/**
	 * Fires when a keyphrase is set to be tracked.
	 *
	 * @param {string} keyphrase The keyphrase to track.
	 *
	 * @returns {void}
	 */
	const onTrackKeyphrase = useCallback( async( keyphrase ) => {
		// Prepare a new request.
		newRequest();
		await performTrackingRequest( keyphrase );
	}, [ newRequest, performTrackingRequest ] );

	// Fetch initial data and re-fetch if the permalink or keyphrases change.
	const prevPermalink = usePrevious( permalink );
	const prevKeyphrases = usePrevious( keyphrases );
	const prevStartAt = usePrevious( startAt );
	const hasParams = permalink && startAt;

	useEffect( () => {
		if ( isLoggedIn && hasParams &&
			( permalink !== prevPermalink || difference( keyphrases, prevKeyphrases ).length || startAt !== prevStartAt ) ) {
			getTrackedKeyphrases();
		}
	}, [
		isLoggedIn,
		permalink,
		prevPermalink,
		keyphrases,
		prevKeyphrases,
		getTrackedKeyphrases,
		hasParams,
		startAt,
		prevStartAt,
	] );

	// Tracks remaining keyphrases if trackAll is set and we have data.
	useEffect( () => {
		if ( isLoggedIn && trackAll && trackedKeyphrases !== null ) {
			const toTrack = keyphrases.filter( k => ! getKeyphraseData( k ) );
			if ( toTrack.length ) {
				performTrackingRequest( toTrack );
			}
			setHasTrackedAll();
		}
	}, [
		isLoggedIn,
		trackAll,
		trackedKeyphrases,
		performTrackingRequest,
		setHasTrackedAll,
		getKeyphraseData,
		keyphrases,
	] );

	// Fetch data after connect.
	useEffect( () => {
		if ( isNewlyAuthenticated && ! hasFetchedKeyphrasesAfterConnect.current ) {
			getTrackedKeyphrases();
			hasFetchedKeyphrasesAfterConnect.current = true;
		}
	}, [
		isNewlyAuthenticated,
		getTrackedKeyphrases,
	] );


	// Set up interval to update ranking data if some of the keyphrases do not have ranking data yet.
	useEffect( () => {
		if ( ! isLoggedIn || isEmpty( trackedKeyphrases ) ) {
			return;
		}

		const someKeyphrasesHaveNoRankingData = filter( trackedKeyphrases, ( trackedKeyphrase ) => {
			return isEmpty( trackedKeyphrase.updated_at );
		} ).length > 0;

		if ( someKeyphrasesHaveNoRankingData ) {
			interval.current = setInterval( () => {
				getTrackedKeyphrases();
			}, 10000 );
		}

		return () => {
			clearInterval( interval.current );
		};
	}, [
		isLoggedIn,
		trackedKeyphrases,
		getTrackedKeyphrases,
	] );

	const isDataLoading = isLoggedIn && trackedKeyphrases === null;

	const trackedKeywordsWithHistory = useMemo( () => isEmpty( trackedKeyphrases ) ? [] : Object.values( trackedKeyphrases )
		.filter( keyword => ! isEmpty( keyword?.position?.history ) )
		.map( keyword => keyword.keyword ), [ trackedKeyphrases ] );

	const areAllSelected = useMemo( () => selectedKeyphrases.length > 0 && trackedKeywordsWithHistory.length > 0 &&
		trackedKeywordsWithHistory.every( selected => selectedKeyphrases.includes( selected ) ),
	[ selectedKeyphrases, trackedKeywordsWithHistory ] );

	/**
	 * Select or deselect all keyphrases.
	 *
	 * @returns {void}
	 */
	const onSelectAllKeyphrases = useCallback( () => {
		onSelectKeyphrases( areAllSelected ? [] : trackedKeywordsWithHistory );
	}, [ onSelectKeyphrases, areAllSelected, trackedKeywordsWithHistory ] );

	const sortedKeyphrases = useMemo( () => orderBy( keyphrases, [
		( keyphrase ) => Object.values( trackedKeyphrases || {} )
			.map( trackedKeyphrase => trackedKeyphrase.keyword ).includes( keyphrase ),
	], [ "desc" ] ), [ keyphrases, trackedKeyphrases ] );

	return (
		keyphrases && ! isEmpty( keyphrases ) && <Fragment>
			<TableWrapper>
				<table className="yoast yoast-table">
					<thead>
						<tr>
							<SelectKeyphraseCheckboxWrapper isDisabled={ trackedKeywordsWithHistory.length === 0 }>
								<Checkbox
									id="select-all"
									onChange={ onSelectAllKeyphrases }
									checked={ areAllSelected }
									label=""
								/>
							</SelectKeyphraseCheckboxWrapper>
							<KeyphraseThWrapper
								scope="col"
								abbr={ __( "Keyphrase", "wordpress-seo" ) }
							>
								{ __( "Keyphrase", "wordpress-seo" ) }
							</KeyphraseThWrapper>
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
							<th
								scope="col"
								abbr={ __( "Last updated", "wordpress-seo" ) }
							>
								{ __( "Last updated", "wordpress-seo" ) }
							</th>
							<th
								scope="col"
								abbr={ __( "Tracking", "wordpress-seo" ) }
							>
								{ __( "Tracking", "wordpress-seo" ) }
							</th>
						</tr>
					</thead>
					<tbody>
						{
							sortedKeyphrases.map( ( keyphrase, index ) => {
								return ( <WincherTableRow
									key={ `trackable-keyphrase-${index}` }
									keyphrase={ keyphrase }
									onTrackKeyphrase={ onTrackKeyphrase }
									onUntrackKeyphrase={ onUntrackKeyphrase }
									rowData={ getKeyphraseData( keyphrase ) }
									isFocusKeyphrase={ keyphrase === focusKeyphrase.trim().toLowerCase() }
									websiteId={ websiteId }
									isDisabled={ ! isLoggedIn }
									isLoading={ isDataLoading || loadingKeyphrases.indexOf( keyphrase.toLowerCase() ) >= 0 }
									isSelected={ selectedKeyphrases.includes( keyphrase ) }
									onSelectKeyphrases={ onSelectKeyphrases }
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
};

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
	setHasTrackedAll: PropTypes.func.isRequired,
	trackAll: PropTypes.bool,
	trackedKeyphrases: PropTypes.object,
	websiteId: PropTypes.string,
	permalink: PropTypes.string.isRequired,
	focusKeyphrase: PropTypes.string,
	startAt: PropTypes.string,
	selectedKeyphrases: PropTypes.arrayOf( PropTypes.string ).isRequired,
	onSelectKeyphrases: PropTypes.func.isRequired,
};

WincherKeyphrasesTable.defaultProps = {
	isLoggedIn: false,
	isNewlyAuthenticated: false,
	keyphrases: [],
	trackAll: false,
	websiteId: "",
	focusKeyphrase: "",
};

export default WincherKeyphrasesTable;
