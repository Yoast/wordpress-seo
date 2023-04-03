/* global wpseoAdminGlobalL10n */

/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { isEmpty, map } from "lodash";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";
import { NewButton } from "@yoast/components";

/* Internal dependencies */
import WincherNoTrackedKeyphrasesAlert from "./modals/WincherNoTrackedKeyphrasesAlert";
import { getKeyphrasePosition, PositionOverTimeChart } from "./WincherTableRow";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";
import interpolateComponents from "interpolate-components";

const ViewLink = makeOutboundLink();
const GetMoreInsightsLink = makeOutboundLink();
const WincherAccountLink = makeOutboundLink();
const WincherLink = makeOutboundLink();

/**
 * Wincher SEO Performance container.
 */
const WicnherSEOPerformanceContainer = styled.div`
`;

const WincherSEOPerformanceReportHeader = styled.h3`
	margin: 8px 0;
	font-size: 1em;
`;

const WincherSEOPerformanceTableWrapper = styled.div`
	position: relative;
	width: 100%;
	overflow-y: auto;
`;

const WincherSEOPerformanceTableBlurredCell = styled.p`
	margin: 0;
    -webkit-filter: blur(2px);
    -moz-filter: blur(2px);
    -o-filter: blur(2px);
    -ms-filter: blur(2px);
    filter: blur(2px);
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

	return <p style={ { bottom: "49%", left: "50%", position: "absolute" } }>
		<NewButton onClick={ onConnectAction } variant="primary" style={ { left: "-50%", backgroundColor: "#2371B0" } }>
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
	children: PropTypes.object,
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
					<ViewLink href={ viewLinkUrl( { websiteId, id } ) } style={ { pointerEvents: isBlurred ? "none" : "initial" } }>
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
 * Gets the proper user message based on the current login state and presence of data.
 *
 * @param {Object} props The props.
 *
 * @returns {wp.Element} The user message.
 */
const GetUserMessage = ( props ) => {
	const { data, onConnectAction } = props;

	if ( data && [ 401, 403, 404 ].includes( data.status ) ) {
		return <WincherReconnectAlert
			onReconnect={ onConnectAction }
		/>;
	}

	if ( ! data || isEmpty( data.results ) ) {
		return <WincherNoTrackedKeyphrasesAlert />;
	}

	return null;
};

GetUserMessage.propTypes = {
	data: PropTypes.object.isRequired,
	onConnectAction: PropTypes.func.isRequired,
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
		// eslint-disable-next-line max-len
		__( "This overview only shows you keyphrases added to Yoast SEO. There may be other keyphrases added to your %s.", "wordpress-seo" ),
		"{{wincherAccountLink/}}"
	);

	const notLoggedInMessage = sprintf(
		/* translators: %s expands to a link to Wincher login */
		// eslint-disable-next-line max-len
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
					wincherLink: <WincherLink href="https://yoa.st/integrations-about-wincher">
						{
							sprintf(
								/* translators: %s : Expands to "Wincher". */
								__( "%s", "wordpress-seo" ),
								"Wincher"
							)
						}
					</WincherLink>,
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
 * The Dashboard Wincer SEO Performance component.
 *
 * @param {Object} props The component props.
 *
 * @returns {wp.Element} The react component.
 */
const WincherPerformanceReport = ( props ) => {
	const { className, websiteId, isLoggedIn, onConnectAction } = props;
	const data = isLoggedIn ? props.data : fakeWincherPerformanceData;

	return (
		<WicnherSEOPerformanceContainer
			className={ className }
		>
			<WincherSEOPerformanceReportHeader
				className={ `${ className }__header` }
			>
				{ __( "Top performing keyphrases on your site", "wordpress-seo" ) }
			</WincherSEOPerformanceReportHeader>

			<GetUserMessage { ...props } data={ data } />

			{ data && ! isEmpty( data ) && ! isEmpty( data.results ) && <Fragment>
				<TableExplanation isLoggedIn={ isLoggedIn } />

				<WincherSEOPerformanceTableWrapper>
					<table className="yoast yoast-table">
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
										isBlurred={ ! isLoggedIn }
									/>;
								} )
							}
						</tbody>
					</table>
				</WincherSEOPerformanceTableWrapper>
				<ConnectToWincher isLoggedIn={ isLoggedIn } onConnectAction={ onConnectAction } />
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
	onConnectAction: PropTypes.func.isRequired,
};

WincherPerformanceReport.defaultProps = {
	className: "wincher-seo-performance",
};

export default WincherPerformanceReport;
