/* global wpseoAdminGlobalL10n */

/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { isEmpty, map } from "lodash";
import interpolateComponents from "interpolate-components";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";
import { Alert, NewButton } from "@yoast/components";

/* Internal dependencies */
import WincherNoTrackedKeyphrasesAlert from "./modals/WincherNoTrackedKeyphrasesAlert";
import { getKeyphrasePosition, PositionOverTimeChart } from "./WincherTableRow";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";
import WincherUpgradeCallout, { useTrackingInfo } from "./modals/WincherUpgradeCallout";

const ViewLink = makeOutboundLink();
const GetMoreInsightsLink = makeOutboundLink();
const WincherAccountLink = makeOutboundLink();
const WincherLink = makeOutboundLink();

/**
 * Wincher SEO Performance container.
 */
const WicnherSEOPerformanceContainer = styled.div`
	& .wincher-performance-report-alert {
		margin-bottom: 1em;
	}
`;

const WincherSEOPerformanceBlurredTable = styled.table`
	pointer-events: none;
	user-select: none;
`;

const WincherSEOPerformanceTableWrapper = styled.div`
	position: relative;
	width: 100%;
	overflow-y: auto;
`;

const WincherSEOPerformanceTableBlurredCell = styled.div`
	margin: 0;
    -webkit-filter: blur(4px);
    -moz-filter: blur(4px);
    -o-filter: blur(4px);
    -ms-filter: blur(4px);
    filter: blur(4px);
`;

const ConnectToWincherWrapper = styled.p`
	top: 47%;
	left: 50%;
	position: absolute;
`;

/**
 * Creates a view link URL based on the passed props.
 *
 * @param {Object} props The props to use for the link URL.
 *
 * @returns {string} The link URL.
 */
const viewLinkUrl = ( props ) => {
	const { websiteId, id } = props;

	return sprintf(
		"https://app.wincher.com/websites/%s/keywords?serp=%s&utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast",
		websiteId,
		id
	);
};

/**
 * Checks if the request has failed or not.
 *
 * @param {Object} data The response data object.
 * @returns {Boolean} Whether the request has failed or not.
 */
const checkFailedRequest = ( data ) => data && [ 401, 403, 404 ].includes( data.status );

/**
 * Creates the Connect to Wincher button.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The connect button or reconnect alert.
 */
const ConnectToWincher = ( props ) => {
	const { isLoggedIn, onConnectAction } = props;

	if ( isLoggedIn ) {
		return null;
	}

	return <ConnectToWincherWrapper>
		<NewButton onClick={ onConnectAction } variant="primary" style={ { left: "-50%", backgroundColor: "#2371B0" } }>
			{ sprintf(
			/* translators: %s expands to Wincher */
				__( "Connect with %s", "wordpress-seo" ),
				"Wincher"
			) }
		</NewButton>
	</ConnectToWincherWrapper>;
};

ConnectToWincher.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	onConnectAction: PropTypes.func.isRequired,
};

/**
 * Creates a new cell to be displayed in the table row.
 *
 * @param {bool} isBlurred Whether to blur the cell.
 *
 * @returns {wp.Element} The cell.
 */
const Cell = ( { isBlurred, children } ) => {
	if ( isBlurred ) {
		return (
			<td>
				<WincherSEOPerformanceTableBlurredCell>
					{ children }
				</WincherSEOPerformanceTableBlurredCell>
			</td>
		);
	}
	return (
		<td>{ children }</td>
	);
};

Cell.propTypes = {
	isBlurred: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.number,
		PropTypes.object,
	] ),
};

/**
 * Creates a new row to be displayed in the table.
 *
 * @param {string} keyphrase The keyphrase data to be used in the row.
 * @param {number} websiteId The website ID to link to.
 * @param {bool} isBlurred Whether to blur the row.
 *
 * @returns {wp.Element} The row.
 */
const Row = ( { keyphrase, websiteId, isBlurred } ) => {
	const { id, keyword } = keyphrase;
	return (
		<tr>
			<Cell isBlurred={ isBlurred }>{ keyword }</Cell>
			<Cell isBlurred={ isBlurred }>{ getKeyphrasePosition( keyphrase ) }</Cell>
			<Cell isBlurred={ isBlurred } className="yoast-table--nopadding">
				{
					<PositionOverTimeChart chartData={ keyphrase } />
				}
			</Cell>
			<Cell isBlurred={ isBlurred } className="yoast-table--nobreak">
				{
					<ViewLink href={ viewLinkUrl( { websiteId, id } ) }>
						{ __( "View", "wordpress-seo" ) }
					</ViewLink>
				}
			</Cell>
		</tr>
	);
};

Row.propTypes = {
	keyphrase: PropTypes.object.isRequired,
	websiteId: PropTypes.string.isRequired,
	isBlurred: PropTypes.bool,
};

/**
 * Displays error alert if a network error happened when connecting to Wincher.
 *
 * @returns {wp.Element} The error alert.
 */
const WincherNetworkErrorAlert = () => {
	return (
		<Alert type="error" className={ "wincher-performance-report-alert" }>
			{
				sprintf(
					__(
						"Network Error: Unable to connect to the server. Please check your internet connection and try again later.",
						"wordpress-seo"
					)
				)
			}
		</Alert>
	);
};

/**
 * Displays info alert when a wincher connect action is successfully made.
 *
 * @param {Object} props The component props.
 *
 * @returns {wp.Element} The info alert.
 */
const WincherConnectSuccessAlert = ( props ) => {
	const { data } = props;

	if ( ! isEmpty( data ) && isEmpty( data.results ) ) {
		return (
			<Alert type="success" className={ "wincher-performance-report-alert" }>
				{
					sprintf(
						/* translators: %1$s and %2$s: Expands to "Wincher". */
						__(
							"You have successfully connected with %1$s. Your %2$s account does not contain any keyphrases for this website yet. You can track keyphrases by using the \"Track SEO Performance\" button in the post editor.",
							"wordpress-seo"
						),
						"Wincher",
						"Wincher"
					)
				}
			</Alert>
		);
	}

	return (
		<Alert type="success" className={ "wincher-performance-report-alert" }>
			{
				sprintf(
					/* translators: %s: Expands to "Wincher". */
					__(
						"You have successfully connected with %s.",
						"wordpress-seo"
					),
					"Wincher"
				)
			}
		</Alert>
	);
};

WincherConnectSuccessAlert.propTypes = {
	data: PropTypes.object.isRequired,
};

/**
 * Gets a connection alert based on the passed props and the data status.
 *
 * @param {Object} props The props.
 *
 * @returns {null|wp.Element} The connection alert.
 */
const GetConnectionAlert = ( props ) => {
	const { data, onConnectAction, isConnectSuccess, isNetworkError, isFailedRequest } = props;

	if ( isNetworkError ) {
		return <WincherNetworkErrorAlert data={ data } />;
	}

	if ( isConnectSuccess ) {
		return <WincherConnectSuccessAlert data={ data } />;
	}

	if ( isFailedRequest ) {
		return <WincherReconnectAlert
			onReconnect={ onConnectAction }
			className={ "wincher-performance-report-alert" }
		/>;
	}

	return null;
};

GetConnectionAlert.propTypes = {
	data: PropTypes.object.isRequired,
	onConnectAction: PropTypes.func.isRequired,
	isConnectSuccess: PropTypes.bool.isRequired,
	isNetworkError: PropTypes.bool.isRequired,
	isFailedRequest: PropTypes.bool.isRequired,
};

/**
 * Gets the proper user message based on the current login state and presence of data.
 *
 * @param {Object} props The props.
 *
 * @returns {wp.Element} The user message.
 */
const GetUserMessage = ( props ) => {
	const { data, isNetworkError, isConnectSuccess } = props;

	const isFailedRequest = checkFailedRequest( data );

	if ( isNetworkError || isConnectSuccess || isFailedRequest ) {
		return <GetConnectionAlert { ...props } isFailedRequest={ isFailedRequest } />;
	}

	if ( ! data || isEmpty( data.results ) ) {
		return <WincherNoTrackedKeyphrasesAlert className={ "wincher-performance-report-alert" } />;
	}

	return null;
};

GetUserMessage.propTypes = {
	data: PropTypes.object.isRequired,
	onConnectAction: PropTypes.func.isRequired,
	isConnectSuccess: PropTypes.bool.isRequired,
	isNetworkError: PropTypes.bool.isRequired,
};

/**
 * TableFootnote component.
 *
 * @param {Object} props The props.
 *
 * @returns {wp.Element} The footnote.
 */
const TableExplanation = ( { isLoggedIn } ) => {
	const loggedInMessage = sprintf(
		/* translators: %s expands to a link to Wincher login */
		__( "This overview only shows you keyphrases added to Yoast SEO. There may be other keyphrases added to your %s.", "wordpress-seo" ),
		"{{wincherAccountLink/}}"
	);

	const notLoggedInMessage = sprintf(
		/* translators: %s expands to a link to Wincher login */
		__( "This overview will show you your top performing keyphrases in Google. Connect with %s to get started.", "wordpress-seo" ),
		"{{wincherLink/}}"
	);

	const message = isLoggedIn ? loggedInMessage : notLoggedInMessage;

	return <p>
		{
			interpolateComponents( {
				mixedString: message,
				components: {
					wincherAccountLink: <WincherAccountLink href={ wpseoAdminGlobalL10n[ "links.wincher.login" ] }>
						{
							sprintf(
								/* translators: %s : Expands to "Wincher". */
								__( "%s account", "wordpress-seo" ),
								"Wincher"
							)
						}
					</WincherAccountLink>,
					wincherLink: <WincherLink href={ wpseoAdminGlobalL10n[ "links.wincher.about" ] }>Wincher</WincherLink>,
				},
			} )
		}
	</p>;
};

TableExplanation.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
};

const fakeWincherPerformanceData = {
	results: [
		{
			id: 0,
			keyword: "wincher",
			position: {
				value: 84,
				history: [
					{ value: 90 },
					{ value: 89 },
					{ value: 94 },
					{ value: 98 },
					{ value: 84 },
				],
			},
		},
		{
			id: 1,
			keyword: "rank tracker",
			position: {
				value: 20,
				history: [
					{ value: 50 },
					{ value: 30 },
					{ value: 66 },
					{ value: 15 },
					{ value: 20 },
				],
			},
		},
		{
			id: 2,
			keyword: "performance",
			position: {
				value: 2,
				history: [
					{ value: 44 },
					{ value: 66 },
					{ value: 18 },
					{ value: 31 },
					{ value: 2 },
				],
			},
		},
	],
};

/**
 * The Wincher SEO performance table.
 *
 * @param {Object} props The component props.
 *
 * @returns {wp.Element} The react component.
 */
const WincherSEOPerformanceTable = ( { isBlurred, children } ) => {
	if ( isBlurred ) {
		return <WincherSEOPerformanceBlurredTable className="yoast yoast-table">
			{ children }
		</WincherSEOPerformanceBlurredTable>;
	}

	return <table className="yoast yoast-table">{ children }</table>;
};

WincherSEOPerformanceTable.propTypes = {
	isBlurred: PropTypes.bool,
	children: PropTypes.any,
};

/**
 * Checks whether Wincher performance data has results.
 *
 * @param {Object} data the Wincher performance data.
 *
 * @returns {boolean} Whether Wincher performance data has results.
 */
const checkHasResults = ( data ) => data && ! isEmpty( data ) && ! isEmpty( data.results );

/**
 * The Dashboard Wincher SEO Performance component.
 *
 * @param {Object} props The component props.
 *
 * @returns {wp.Element} The react component.
 */
const WincherPerformanceReport = ( props ) => {
	const { className, websiteId, isLoggedIn, onConnectAction, isConnectSuccess } = props;
	const data = isLoggedIn ? props.data : fakeWincherPerformanceData;
	const isBlurred = ! isLoggedIn;
	const hasResults = checkHasResults( data );
	const trackingInfo = useTrackingInfo( isLoggedIn );

	return (
		<WicnherSEOPerformanceContainer
			className={ className }
		>
			{ isLoggedIn && <WincherUpgradeCallout isTitleShortened={ true } trackingInfo={ trackingInfo } /> }

			<GetUserMessage { ...props } data={ data } isConnectSuccess={ isConnectSuccess && isLoggedIn } />

			{ hasResults && <Fragment>
				<TableExplanation isLoggedIn={ isLoggedIn } />

				<WincherSEOPerformanceTableWrapper>
					<WincherSEOPerformanceTable isBlurred={ isBlurred }>
						<thead>
							<tr>
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
								map( data.results, ( entry, index ) => {
									return <Row
										key={ `keyphrase-${index}` }
										keyphrase={ entry }
										websiteId={ websiteId }
										isBlurred={ isBlurred }
									/>;
								} )
							}
						</tbody>
					</WincherSEOPerformanceTable>
					<ConnectToWincher isLoggedIn={ isLoggedIn } onConnectAction={ onConnectAction } />
				</WincherSEOPerformanceTableWrapper>
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
				</p>
			</Fragment> }

		</WicnherSEOPerformanceContainer>
	);
};

WincherPerformanceReport.propTypes = {
	className: PropTypes.string,
	data: PropTypes.object.isRequired,
	websiteId: PropTypes.string.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	isConnectSuccess: PropTypes.bool.isRequired,
	isNetworkError: PropTypes.bool.isRequired,
	onConnectAction: PropTypes.func.isRequired,
};

WincherPerformanceReport.defaultProps = {
	className: "wincher-seo-performance",
};

export default WincherPerformanceReport;
