/* global wpseoAdminGlobalL10n */
import { Fragment } from "@wordpress/element";
import { isEmpty, map } from "lodash";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";
import { Alert, NewButton } from "@yoast/components";
import { safeCreateInterpolateElement } from "../helpers/i18n";

/* Internal dependencies */
import WincherNoTrackedKeyphrasesAlert from "./modals/WincherNoTrackedKeyphrasesAlert";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";
import WincherUpgradeCallout, { useTrackingInfo } from "./modals/WincherUpgradeCallout";
import { getKeyphrasePosition, PositionOverTimeChart } from "./WincherTableRow";

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
 * @param {string} websiteId The website ID to link to.
 * @param {string} id The keyword ID to link to.
 *
 * @returns {string} The link URL.
 */
const viewLinkUrl = ( { websiteId, id } ) => {
	return `https://app.wincher.com/websites/${ websiteId }/keywords?serp=${ id }&utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast`;
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
 * @param {boolean} isLoggedIn Whether the user is logged in.
 * @param {function} onConnectAction The function to call when the user wants to connect.
 *
 * @returns {JSX.Element} The connect button or reconnect alert, or null if the user is logged in.
 */
const ConnectToWincher = ( { isLoggedIn, onConnectAction } ) => {
	if ( isLoggedIn ) {
		return null;
	}

	return <ConnectToWincherWrapper>
		<NewButton onClick={ onConnectAction } variant="primary" style={ { left: "-50%", backgroundColor: "#2371b0" } }>
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
 * @param {boolean} isBlurred Whether to blur the cell.
 * @param {React.ReactNode} children The content of the cell.
 *
 * @returns {JSX.Element} The cell.
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
	isBlurred: PropTypes.bool.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.number,
		PropTypes.object,
	] ).isRequired,
};

/**
 * Creates a new row to be displayed in the table.
 *
 * @param {Object} keyphrase The keyphrase data to be used in the row.
 * @param {string} websiteId The website ID to link to.
 * @param {boolean} isBlurred Whether to blur the row.
 *
 * @returns {JSX.Element} The row.
 */
const Row = ( { keyphrase, websiteId, isBlurred } ) => {
	return (
		<tr>
			<Cell isBlurred={ isBlurred }>{ keyphrase.keyword }</Cell>
			<Cell isBlurred={ isBlurred }>{ getKeyphrasePosition( keyphrase ) }</Cell>
			<Cell isBlurred={ isBlurred } className="yoast-table--nopadding">
				{
					<PositionOverTimeChart chartData={ keyphrase } />
				}
			</Cell>
			<Cell isBlurred={ isBlurred } className="yoast-table--nobreak">
				{
					<ViewLink href={ viewLinkUrl( { websiteId, id: keyphrase.id } ) }>
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
	isBlurred: PropTypes.bool.isRequired,
};

/**
 * Displays error alert if a network error happened when connecting to Wincher.
 *
 * @returns {JSX.Element} The error alert.
 */
const WincherNetworkErrorAlert = () => {
	return (
		<Alert type="error" className={ "wincher-performance-report-alert" }>
			{
				__(
					"Network Error: Unable to connect to the server. Please check your internet connection and try again later.",
					"wordpress-seo"
				)
			}
		</Alert>
	);
};

/**
 * Displays info alert when a wincher connect action is successfully made.
 *
 * @param {Object} data The Wincher performance data.
 *
 * @returns {JSX.Element} The info alert.
 */
const WincherConnectSuccessAlert = ( { data } ) => {
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
 * @param {Object} data The Wincher performance data.
 * @param {function} onConnectAction The function to call when the user wants to connect.
 * @param {boolean} isConnectSuccess Whether the connection was successful.
 * @param {boolean} isNetworkError Whether there was a network error.
 * @param {boolean} isFailedRequest Whether the request failed.
 *
 * @returns {JSX.Element} The connection alert, or null if no alert is needed.
 */
const GetConnectionAlert = ( { data, onConnectAction, isConnectSuccess, isNetworkError, isFailedRequest } ) => {
	if ( isNetworkError ) {
		return <WincherNetworkErrorAlert />;
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
 * @param {Object} data The Wincher performance data.
 * @param {function} onConnectAction The function to call when the user wants to connect.
 * @param {boolean} isConnectSuccess Whether the connection was successful.
 * @param {boolean} isNetworkError Whether there was a network error.
 *
 * @returns {JSX.Element} The user message.
 */
const GetUserMessage = ( { data, onConnectAction, isNetworkError, isConnectSuccess } ) => {
	const isFailedRequest = checkFailedRequest( data );

	if ( isNetworkError || isConnectSuccess || isFailedRequest ) {
		return <GetConnectionAlert
			data={ data }
			onConnectAction={ onConnectAction }
			isConnectSuccess={ isConnectSuccess }
			isNetworkError={ isNetworkError }
			isFailedRequest={ isFailedRequest }
		/>;
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
		"<wincherAccountLink/>"
	);

	const notLoggedInMessage = sprintf(
		/* translators: %s expands to a link to Wincher login */
		__( "This overview will show you your top performing keyphrases in Google. Connect with %s to get started.", "wordpress-seo" ),
		"<wincherLink/>"
	);

	const message = isLoggedIn ? loggedInMessage : notLoggedInMessage;

	return <p>
		{
			safeCreateInterpolateElement( message, {
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
			} )
		}
	</p>;
};

TableExplanation.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
};

/**
 * The Wincher SEO performance table.
 *
 * @param {boolean} isBlurred Whether the table should be blurred.
 * @param {React.ReactNode} children The content of the table.
 *
 * @returns {JSX.Element} The react component.
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
	isBlurred: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired,
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
 * @param {string} [className="wincher-seo-performance"] The class name.
 * @param {Object} data The Wincher performance data.
 * @param {string} websiteId The website ID.
 * @param {boolean} isLoggedIn Whether the user is logged in.
 * @param {boolean} isConnectSuccess Whether the connection was successful.
 * @param {boolean} isNetworkError Whether there was a network error.
 * @param {function} onConnectAction Callback to connect.
 *
 * @returns {JSX.Element} The react component.
 */
const WincherPerformanceReport = ( {
	className = "wincher-seo-performance",
	data,
	websiteId,
	isLoggedIn,
	isConnectSuccess,
	isNetworkError,
	onConnectAction,
} ) => {
	const isBlurred = ! isLoggedIn;
	const hasResults = checkHasResults( data );
	const trackingInfo = useTrackingInfo( isLoggedIn );

	return (
		<WicnherSEOPerformanceContainer className={ className }>
			{ isLoggedIn && <WincherUpgradeCallout isTitleShortened={ true } trackingInfo={ trackingInfo } /> }

			<GetUserMessage
				data={ data }
				onConnectAction={ onConnectAction }
				isNetworkError={ isNetworkError }
				isConnectSuccess={ isConnectSuccess && isLoggedIn }
			/>

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
										key={ `keyphrase-${ index }` }
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

export default WincherPerformanceReport;
