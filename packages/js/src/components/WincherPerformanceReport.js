/* global wpseoAdminGlobalL10n */

/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { isEmpty, map } from "lodash-es";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";
import { NewButton } from "@yoast/components";

/* Internal dependencies */
import WincherConnectExplanation from "./modals/WincherConnectExplanation";
import WincherNoTrackedKeyphrasesAlert from "./modals/WincherNoTrackedKeyphrasesAlert";
import { getKeyphrasePosition, PositionOverTimeChart } from "./WincherTableRow";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";
import interpolateComponents from "interpolate-components";

const ViewLink = makeOutboundLink();
const GetMoreInsightsLink = makeOutboundLink();
const WincherAccountLink = makeOutboundLink();

/**
 * Wincher SEO Performance container.
 */
const WicnherSEOPerformanceContainer = styled.div`
`;

/**
 * Wincher SEO Performance top text.
 */
const WincherSEOPerformanceReportText = styled.div`
	font-size: 14px;
`;

const WincherSEOPerformanceReportHeader = styled.h3`
	margin: 8px 0;
	font-size: 1em;
`;

const WincherSEOPerformanceTableWrapper = styled.div`
	width: 100%;
	overflow-y: auto;
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
 * Renders the 'Not connected' message.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The message.
 */
const NotConnectedMessage = ( props ) => {
	const { className, onConnectAction } = props;

	return (
		<WincherSEOPerformanceReportText
			className={ `${ className }__text` }
		>
			<WincherConnectExplanation />

			<div className={ "yoast" }>
				<NewButton
					variant={ "secondary" }
					id="yoast-connect-wincher-dashboard-widget"
					onClick={ onConnectAction }
				>
					{ sprintf(
						/* translators: %s expands to Wincher */
						__( "Connect with %s", "wordpress-seo" ),
						"Wincher"
					) }
				</NewButton>
			</div>
		</WincherSEOPerformanceReportText>
	);
};

NotConnectedMessage.propTypes = {
	className: PropTypes.string,
	onConnectAction: PropTypes.func.isRequired,
};

NotConnectedMessage.defaultProps = {
	className: "",
};

/**
 * Creates a new row to be displayed in the table.
 *
 * @param {string} keyphrase The keyphrase data to be used in the row.
 * @param {number} websiteId The website ID to link to.
 *
 * @returns {wp.Element} The row.
 */
const Row = ( { keyphrase, websiteId } ) => {
	const { id, keyword } = keyphrase;
	return (
		<tr>
			<td>{ keyword }</td>
			<td>{ getKeyphrasePosition( keyphrase ) }</td>
			<td className="yoast-table--nopadding">{ <PositionOverTimeChart chartData={ keyphrase } /> }</td>
			<td className="yoast-table--nobreak">
				{
					<ViewLink href={ viewLinkUrl( { websiteId, id } ) }>
						{ __( "View", "wordpress-seo" ) }
					</ViewLink>
				}
			</td>
		</tr>
	);
};

Row.propTypes = {
	keyphrase: PropTypes.object.isRequired,
	websiteId: PropTypes.string.isRequired,
};

/**
 * Gets the proper user message based on the current login state and presence of data.
 *
 * @param {Object} props The props.
 *
 * @returns {wp.Element} The user message.
 */
const GetUserMessage = ( props ) => {
	const { isLoggedIn, data, onConnectAction } = props;

	if ( ! isLoggedIn ) {
		return <NotConnectedMessage { ...props } />;
	}

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
	isLoggedIn: PropTypes.bool.isRequired,
	data: PropTypes.object.isRequired,
	onConnectAction: PropTypes.func.isRequired,
};

/**
 * TableFootnote component.
 *
 * @returns {wp.Element} The footnote.
 */
const TableExplanation = () => {
	const message = sprintf(
		/* translators: %s expands to a link to Wincher login */
		// eslint-disable-next-line max-len
		__( "This overview only shows you keyphrases added to Yoast SEO. There may be other keyphrases added to your %s.", "wordpress-seo" ),
		"{{wincherAccountLink/}}"
	);

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
				},
			} )
		}
	</p>;
};

/**
 * The Dashboard Wincer SEO Performance component.
 *
 * @param {Object} props The component props.
 *
 * @returns {wp.Element} The react component.
 */
const WincherPerformanceReport = ( props ) => {
	const { className, websiteId, isLoggedIn, data } = props;

	return (
		<WicnherSEOPerformanceContainer
			className={ className }
		>
			<WincherSEOPerformanceReportHeader
				className={ `${ className }__header` }
			>
				{ __( "Top performing keyphrases on your site", "wordpress-seo" ) }
			</WincherSEOPerformanceReportHeader>

			<GetUserMessage { ...props } />

			{ isLoggedIn && data && ! isEmpty( data ) && ! isEmpty( data.results ) && <Fragment>
				<TableExplanation />

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
									/>;
								} )
							}
						</tbody>
					</table>
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
};

WincherPerformanceReport.defaultProps = {
	className: "wincher-seo-performance",
};

export default WincherPerformanceReport;
