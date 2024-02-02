/* global wpseoAdminL10n */

/* External dependencies */
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { usePrevious } from "@wordpress/compose";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { difference, isEmpty, orderBy } from "lodash";
import styled from "styled-components";
import moment from "moment";

/* Yoast dependencies */
import { NewButton, HelpIcon } from "@yoast/components";

/* Internal dependencies */
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherRequestFailed from "./modals/WincherRequestFailed";
import WincherUpgradeCallout, { useTrackingInfo } from "./modals/WincherUpgradeCallout";
import WincherConnectedAlert from "./modals/WincherConnectedAlert";
import WincherCurrentlyTrackingAlert from "./modals/WincherCurrentlyTrackingAlert";
import WincherKeyphrasesTable from "../containers/WincherKeyphrasesTable";
import WincherExplanation from "./modals/WincherExplanation";
import WincherNoKeyphraseSet from "./modals/WincherNoKeyphraseSet";
import WincherAutoTrackingEnabledAlert from "./modals/WincherAutoTrackingEnabledAlert";
import LoginPopup from "../helpers/loginPopup";
import { authenticate, getAuthorizationUrl, trackKeyphrases } from "../helpers/wincherEndpoints";
import { handleAPIResponse } from "../helpers/api";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";
import WincherNoPermalinkAlert from "./modals/WincherNoPermalinkAlert";
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
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The user message.
 */
const GetUserMessage = ( {
	isSuccess,
	response,
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

GetUserMessage.defaultProps = {
	response: {},
};

let currentPopup = null;

/**
 * Get the tokens using the provided code after user has granted authorization.
 *
 * @param {Object} props The props.
 * @param {Object} data The message data.
 *
 * @returns {void}
 */
const performAuthenticationRequest = async( props, data ) => {
	const {
		onAuthentication,
		setRequestSucceeded,
		setRequestFailed,
		keyphrases,
		addTrackedKeyphrase,
		setKeyphraseLimitReached,
	} = props;

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
 *
 * @returns {void}
 */
const onLoginOpen = async( props ) => {
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
				callback: ( data ) => performAuthenticationRequest( props, data ),
			},
			error: {
				type: "wincher:oauth:error",
				callback: () => props.onAuthentication( false, false ),
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
	`};
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
 * @param {Object} props The component props.
 *
 * @returns {null|wp.Element} The Wincher period picker.
 */
const WincherPeriodPicker = ( props ) => {
	const { onSelect, selected, options, isLoggedIn } = props;

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
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The table content.
 */
const TableContent = ( props ) => {
	const {
		trackedKeyphrases,
		isLoggedIn,
		keyphrases,
		shouldTrackAll,
		permalink,
		historyDaysLimit,
	} = props;

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
 *
 * @returns {wp.Element} The Wincher SEO Performance modal content.
 */
export default function WincherSEOPerformance( props ) {
	const {
		isNewlyAuthenticated,
		isLoggedIn,
	} = props;

	const onLoginCallback = useCallback( () => {
		onLoginOpen( props );
	}, [ onLoginOpen, props ] );
	const trackingInfo = useTrackingInfo( isLoggedIn );

	return (
		<Wrapper>
			{ isNewlyAuthenticated && <WincherConnectedAlert /> }
			{ isLoggedIn && <WincherUpgradeCallout trackingInfo={ trackingInfo }  /> }

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
			<GetUserMessage { ...props } onLogin={ onLoginCallback } />
			<TableContent { ...props } historyDaysLimit={ trackingInfo?.historyDays || 31 } />
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
	historyDaysLimit: PropTypes.number,
};

WincherSEOPerformance.defaultProps = {
	trackedKeyphrases: null,
	isLoggedIn: false,
	isNewlyAuthenticated: false,
	keyphrases: [],
	response: {},
	shouldTrackAll: false,
	permalink: "",
	historyDaysLimit: 0,
};
