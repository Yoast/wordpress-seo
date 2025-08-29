/* eslint-disable complexity */
/* global wpseoAdminL10n */
import { usePrevious } from "@wordpress/compose";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { HelpIcon, NewButton } from "@yoast/components";
import { difference, isEmpty, orderBy } from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import styled from "styled-components";
import WincherKeyphrasesTable from "../containers/WincherKeyphrasesTable";
import { handleAPIResponse } from "../helpers/api";
import LoginPopup from "../helpers/loginPopup";
import { authenticate, getAuthorizationUrl, trackKeyphrases } from "../helpers/wincherEndpoints";
import WincherAutoTrackingEnabledAlert from "./modals/WincherAutoTrackingEnabledAlert";
import WincherConnectedAlert from "./modals/WincherConnectedAlert";
import WincherCurrentlyTrackingAlert from "./modals/WincherCurrentlyTrackingAlert";
import WincherExplanation from "./modals/WincherExplanation";
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherNoKeyphraseSet from "./modals/WincherNoKeyphraseSet";
import WincherNoPermalinkAlert from "./modals/WincherNoPermalinkAlert";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";
import WincherRequestFailed from "./modals/WincherRequestFailed";
import WincherUpgradeCallout, { useTrackingInfo } from "./modals/WincherUpgradeCallout";
import WincherRankingHistoryChart from "./WincherRankingHistoryChart";

/**
 * Gets the proper error message component.
 *
 * @param {Object} response The response object to base the error message on.
 * @param {Function} onLogin The onLogin callback used when reconnecting.
 *
 * @returns {wp.Element} The error message component.
 */
const GetErrorMessage = ( { response, onLogin } ) => {
	if ( [ 401, 403, 404 ].includes( response.status ) ) {
		return <WincherReconnectAlert onReconnect={ onLogin } />;
	}

	return <WincherRequestFailed />;
};

GetErrorMessage.propTypes = {
	response: PropTypes.object.isRequired,
	onLogin: PropTypes.func.isRequired,
};

/**
 * Gets a user message based on the passed props' values.
 *
 * @param {boolean} isSuccess Whether the request was successful.
 * @param {Object} [response={}] The response object.
 * @param {boolean} allKeyphrasesMissRanking Whether all keyphrases miss ranking.
 * @param {Function} onLogin Callback for login.
 * @param {boolean} keyphraseLimitReached Whether the keyphrase limit is reached.
 * @param {number} limit The keyphrase limit.
 *
 * @returns {JSX.Element} The user message, null if no message.
 */
const GetUserMessage = ( {
	isSuccess,
	response = {},
	allKeyphrasesMissRanking,
	onLogin,
	keyphraseLimitReached,
	limit,
} ) => {
	if ( keyphraseLimitReached ) {
		return <WincherLimitReached limit={ limit } />;
	}

	if ( ! isEmpty( response ) && ! isSuccess ) {
		return <GetErrorMessage response={ response } onLogin={ onLogin } />;
	}

	if ( allKeyphrasesMissRanking ) {
		return <WincherCurrentlyTrackingAlert />;
	}

	return null;
};

GetUserMessage.propTypes = {
	isSuccess: PropTypes.bool.isRequired,
	allKeyphrasesMissRanking: PropTypes.bool.isRequired,
	response: PropTypes.object,
	onLogin: PropTypes.func.isRequired,
	keyphraseLimitReached: PropTypes.bool.isRequired,
	limit: PropTypes.number.isRequired,
};

let currentPopup = null;

/**
 * Get the tokens using the provided code after user has granted authorization.
 *
 * @param {Object} props The props.
 * @param {Function} props.onAuthentication Callback to call when authentication is successful.
 * @param {Function} props.setRequestSucceeded Callback to call when the request is successful.
 * @param {Function} props.setRequestFailed Callback to call when the request fails.
 * @param {Array} props.keyphrases The keyphrases to track.
 * @param {Function} props.addTrackedKeyphrase Callback to add a tracked keyphrase.
 * @param {Function} props.setKeyphraseLimitReached Callback to set the keyphrase limit reached state.
 * @param {Object} data The message data.
 *
 * @returns {void}
 */
const performAuthenticationRequest = async( {
	onAuthentication,
	setRequestSucceeded,
	setRequestFailed,
	keyphrases,
	addTrackedKeyphrase,
	setKeyphraseLimitReached,
}, data ) => {
	await handleAPIResponse(
		() => authenticate( data ),
		async( response ) => {
			onAuthentication( true, true, data.websiteId.toString() );
			setRequestSucceeded( response );

			const keyphrasesArray = ( Array.isArray( keyphrases ) ? keyphrases : [ keyphrases ] )
				.map( k => k.toLowerCase() );
			await handleAPIResponse(
				() => trackKeyphrases( keyphrasesArray ),
				( keyphrasesResponse ) => {
					setRequestSucceeded( keyphrasesResponse );
					addTrackedKeyphrase( keyphrasesResponse.results );
				},
				( keyphrasesResponse ) => {
					if ( keyphrasesResponse.status === 400 && keyphrasesResponse.limit ) {
						setKeyphraseLimitReached( keyphrasesResponse.limit );
					}
					setRequestFailed( keyphrasesResponse );
				},
				201
			);
			// Close the popup if it's been opened again by mistake.
			const popup = currentPopup.getPopup();

			if ( popup ) {
				popup.close();
			}
		},
		async( response ) => setRequestFailed( response )
	);
};

/**
 * Opens the popup window.
 *
 * @param {Object} props The props.
 * @param {Function} props.onAuthentication Callback to call when authentication is successful.
 * @param {Function} props.setRequestSucceeded Callback to call when the request is successful.
 * @param {Function} props.setRequestFailed Callback to call when the request fails.
 * @param {Array} props.keyphrases The keyphrases to track.
 * @param {Function} props.addTrackedKeyphrase Callback to add a tracked keyphrase.
 * @param {Function} props.setKeyphraseLimitReached Callback to set the keyphrase limit reached state.
 *
 * @returns {void}
 */
const onLoginOpen = async( {
	onAuthentication,
	setRequestSucceeded,
	setRequestFailed,
	keyphrases,
	addTrackedKeyphrase,
	setKeyphraseLimitReached,
} ) => {
	if ( currentPopup && ! currentPopup.isClosed() ) {
		currentPopup.focus();
		return;
	}

	const { url } = await getAuthorizationUrl();

	currentPopup = new LoginPopup(
		url,
		{
			success: {
				type: "wincher:oauth:success",
				callback: ( data ) => performAuthenticationRequest( {
					onAuthentication,
					setRequestSucceeded,
					setRequestFailed,
					keyphrases,
					addTrackedKeyphrase,
					setKeyphraseLimitReached,
				}, data ),
			},
			error: {
				type: "wincher:oauth:error",
				callback: () => onAuthentication( false, false ),
			},
		},
		{
			title: "Wincher_login",
			width: 500,
			height: 700,
		}
	);

	currentPopup.createPopup();
};

/**
 * Creates the Connect to Wincher button.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The connect button or reconnect alert.
 */
const ConnectToWincher = ( props ) => {
	if ( props.isLoggedIn ) {
		return null;
	}

	return <p>
		<NewButton onClick={ props.onLogin } variant="primary">
			{ sprintf(
				/* translators: %s expands to Wincher */
				__( "Connect with %s", "wordpress-seo" ),
				"Wincher"
			) }
		</NewButton>
	</p>;
};

ConnectToWincher.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	onLogin: PropTypes.func.isRequired,
};

// We need this wrapper to get consistent paragraph margins in both Elementor and Gutenberg.
const Wrapper = styled.div`
	p {
		margin: 1em 0;
	}
`;

const TableWrapper = styled.div`
	${ props => props.isDisabled && `
		opacity: .5;
		pointer-events: none;
	` };
`;

const Title = styled.div`
	font-weight: var(--yoast-font-weight-bold);
	color: var(--yoast-color-label);
	font-size: var(--yoast-font-size-default);
`;

const WincherChartSettings = styled.div.attrs( { className: "yoast-field-group" } )`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 14px;
`;

const ChartWrapper = styled.div`
	margin: 8px 0;
`;

const START_OF_TODAY = moment.utc().startOf( "day" );

const WINCHER_PERIOD_OPTIONS = [
	{
		name: __( "Last day", "wordpress-seo" ),
		value: moment( START_OF_TODAY ).subtract( 1, "days" ).format(),
		defaultIndex: 1,
	},
	{
		name: __( "Last week", "wordpress-seo" ),
		value: moment( START_OF_TODAY ).subtract( 1, "week" ).format(),
		defaultIndex: 2,
	},
	{
		name: __( "Last month", "wordpress-seo" ),
		value: moment( START_OF_TODAY ).subtract( 1, "month" ).format(),
		defaultIndex: 3,
	},
	{
		name: __( "Last year", "wordpress-seo" ),
		value: moment( START_OF_TODAY ).subtract( 1, "year" ).format(),
		defaultIndex: 0,
	},
];

/**
 * Displays the Wincher period picker.
 *
 * @param {Function} onSelect The callback to call when a period is selected.
 * @param {?{name: string, value: string, defaultIndex: number}} [selected=null] The currently selected period.
 * @param {{name: string, value: string, defaultIndex: number}[]} options The available period options.
 * @param {boolean} isLoggedIn Whether the user is logged in to Wincher.
 *
 * @returns {JSX.Element} The Wincher period picker, or null if not logged in or no options available.
 */
const WincherPeriodPicker = ( { onSelect, selected = null, options, isLoggedIn } ) => {
	if ( ! isLoggedIn ) {
		return null;
	}

	if ( options.length < 1 ) {
		return null;
	}

	return (
		<select
			className="components-select-control__input"
			id="wincher-period-picker"
			value={ selected?.value || options[ 0 ].value }
			onChange={ onSelect }
		>
			{
				options.map( opt => {
					return (
						<option
							key={ opt.name }
							value={ opt.value }
						>
							{ opt.name }
						</option>
					);
				} )
			}
		</select>
	);
};

WincherPeriodPicker.propTypes = {
	onSelect: PropTypes.func.isRequired,
	selected: PropTypes.object,
	options: PropTypes.array.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
};

/**
 * Creates the table content.
 *
 * @param {?Object} [trackedKeyphrases=null] The tracked keyphrases.
 * @param {boolean} isLoggedIn Whether the user is logged in to Wincher.
 * @param {Array} keyphrases The keyphrases.
 * @param {boolean} shouldTrackAll Whether all keyphrases should be tracked.
 * @param {string} permalink The permalink of the post.
 * @param {number} [historyDaysLimit=0] The history days limit for the chart.
 *
 * @returns {JSX.Element} The table content.
 */
const TableContent = ( {
	trackedKeyphrases = null,
	isLoggedIn,
	keyphrases,
	shouldTrackAll,
	permalink,
	historyDaysLimit = 0,
} ) => {
	if ( ! permalink && isLoggedIn ) {
		return <WincherNoPermalinkAlert />;
	}

	if ( keyphrases.length === 0 ) {
		return <WincherNoKeyphraseSet />;
	}

	const historyLimitDate = moment( START_OF_TODAY ).subtract( historyDaysLimit, "days" );

	const periodOptions = WINCHER_PERIOD_OPTIONS.filter(
		opt => moment( opt.value ).isSameOrAfter( historyLimitDate )
	);

	const defaultPeriod = orderBy( periodOptions, opt => opt.defaultIndex, "desc" )[ 0 ];

	const [ period, setPeriod ] = useState( defaultPeriod );

	const [ selectedKeyphrases, setSelectedKeyphrases ] = useState( [] );

	const isChartShown = selectedKeyphrases.length > 0;

	const trackedKeyphrasesPrev = usePrevious( trackedKeyphrases );

	useEffect( () => {
		if ( ! isEmpty( trackedKeyphrases ) && difference( Object.keys( trackedKeyphrases ), Object.keys( trackedKeyphrasesPrev || [] ) ).length ) {
			const keywords = Object.values( trackedKeyphrases ).map( keyphrase => keyphrase.keyword );
			setSelectedKeyphrases( keywords );
		}
	}, [ trackedKeyphrases, trackedKeyphrasesPrev ] );

	useEffect( () => {
		setPeriod( defaultPeriod );
	}, [ defaultPeriod?.name ] );

	const onSelectPeriod = useCallback( ( event ) => {
		const option = WINCHER_PERIOD_OPTIONS.find( opt => opt.value === event.target.value );
		if ( option ) {
			setPeriod( option );
		}
	}, [ setPeriod ] );

	const chartData = useMemo( () => {
		if ( isEmpty( selectedKeyphrases ) ) {
			return [];
		}
		if ( isEmpty( trackedKeyphrases ) ) {
			return [];
		}
		return Object.values( trackedKeyphrases )
			.filter( keyphrase => !! keyphrase?.position?.history )
			.map( keyphrase => ( {
				label: keyphrase.keyword,
				data: keyphrase.position.history,
				selected: selectedKeyphrases.includes( keyphrase.keyword ) && ! isEmpty( keyphrase.position?.history ),
			} ) );
	}, [ selectedKeyphrases, trackedKeyphrases ] );

	return <TableWrapper isDisabled={ ! isLoggedIn }>
		<p>{ __( "You can enable / disable tracking the SEO performance for each keyphrase below.", "wordpress-seo" ) }</p>

		{ isLoggedIn && shouldTrackAll && <WincherAutoTrackingEnabledAlert /> }

		<WincherChartSettings>
			<WincherPeriodPicker
				selected={ period }
				onSelect={ onSelectPeriod }
				options={ periodOptions }
				isLoggedIn={ isLoggedIn }
			/>
		</WincherChartSettings>

		<ChartWrapper>
			<WincherRankingHistoryChart
				isChartShown={ isChartShown }
				datasets={ chartData }
				keyphrases={ keyphrases }
			/>
		</ChartWrapper>

		<WincherKeyphrasesTable
			startAt={ period?.value }
			selectedKeyphrases={ selectedKeyphrases }
			onSelectKeyphrases={ setSelectedKeyphrases }
			trackedKeyphrases={ trackedKeyphrases }
		/>
	</TableWrapper>;
};

TableContent.propTypes = {
	trackedKeyphrases: PropTypes.object,
	keyphrases: PropTypes.array.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	shouldTrackAll: PropTypes.bool.isRequired,
	permalink: PropTypes.string.isRequired,
	historyDaysLimit: PropTypes.number,
};

/**
 * Renders the Wincher SEO Performance modal content.
 *
 * @param {Object} props The props to use within the content.
 * @param {Object} [trackedKeyphrases=null] The tracked keyphrases.
 * @param {Function} addTrackedKeyphrase Callback to add a tracked keyphrase.
 * @param {boolean} [isLoggedIn=false] Whether the user is logged in.
 * @param {boolean} [isNewlyAuthenticated=false] Whether the user is newly authenticated.
 * @param {Array} [keyphrases=[]] The keyphrases.
 * @param {Object} [response={}] The response object.
 * @param {boolean} [shouldTrackAll=false] Whether all keyphrases should be tracked.
 * @param {string} [permalink=""] The permalink.
 * @param {boolean} allKeyphrasesMissRanking Whether all keyphrases miss ranking.
 * @param {boolean} isSuccess Whether the request was successful.
 * @param {boolean} keyphraseLimitReached Whether the keyphrase limit is reached.
 * @param {number} limit The keyphrase limit.
 * @param {Function} setRequestSucceeded Callback to set the request succeeded state.
 * @param {Function} setRequestFailed Callback to set the request failed state.
 * @param {Function} setKeyphraseLimitReached Callback to set the keyphrase limit reached state.
 * @param {Function} onAuthentication Callback to call when authentication is successful.
 *
 * @returns {JSX.Element} The Wincher SEO Performance modal content.
 */
export default function WincherSEOPerformance( {
	trackedKeyphrases = null,
	addTrackedKeyphrase,
	isLoggedIn = false,
	isNewlyAuthenticated = false,
	keyphrases = [],
	response = {},
	shouldTrackAll = false,
	permalink = "",
	allKeyphrasesMissRanking,
	isSuccess,
	keyphraseLimitReached,
	limit,
	setRequestSucceeded,
	setRequestFailed,
	setKeyphraseLimitReached,
	onAuthentication,
} ) {
	const onLoginCallback = useCallback( () => {
		onLoginOpen( {
			onAuthentication,
			setRequestSucceeded,
			setRequestFailed,
			keyphrases,
			addTrackedKeyphrase,
			setKeyphraseLimitReached,
		} );
	}, [ onLoginOpen, onAuthentication, setRequestSucceeded, setRequestFailed, keyphrases, addTrackedKeyphrase, setKeyphraseLimitReached ] );
	const trackingInfo = useTrackingInfo( isLoggedIn );

	return (
		<Wrapper>
			{ isNewlyAuthenticated && <WincherConnectedAlert /> }
			{ isLoggedIn && <WincherUpgradeCallout trackingInfo={ trackingInfo } /> }

			<Title>
				{ __( "SEO performance", "wordpress-seo" ) }
				<HelpIcon
					linkTo={ wpseoAdminL10n[ "shortlinks.wincher.seo_performance" ] }
					/* translators: Hidden accessibility text. */
					linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
				/>
			</Title>

			<WincherExplanation />

			<ConnectToWincher isLoggedIn={ isLoggedIn } onLogin={ onLoginCallback } />
			<GetUserMessage
				isSuccess={ isSuccess }
				response={ response }
				allKeyphrasesMissRanking={ allKeyphrasesMissRanking }
				keyphraseLimitReached={ keyphraseLimitReached }
				limit={ limit }
				onLogin={ onLoginCallback }
			/>
			<TableContent
				trackedKeyphrases={ trackedKeyphrases }
				isLoggedIn={ isLoggedIn }
				keyphrases={ keyphrases }
				shouldTrackAll={ shouldTrackAll }
				permalink={ permalink }
				historyDaysLimit={ trackingInfo?.historyDays || 31 }
			/>
		</Wrapper>
	);
}

WincherSEOPerformance.propTypes = {
	trackedKeyphrases: PropTypes.object,
	addTrackedKeyphrase: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool,
	isNewlyAuthenticated: PropTypes.bool,
	keyphrases: PropTypes.array,
	response: PropTypes.object,
	shouldTrackAll: PropTypes.bool,
	permalink: PropTypes.string,
	allKeyphrasesMissRanking: PropTypes.bool.isRequired,
	isSuccess: PropTypes.bool.isRequired,
	keyphraseLimitReached: PropTypes.bool.isRequired,
	limit: PropTypes.number.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	setKeyphraseLimitReached: PropTypes.func.isRequired,
	onAuthentication: PropTypes.func.isRequired,
};
