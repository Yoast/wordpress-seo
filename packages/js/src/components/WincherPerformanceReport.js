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
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";

const ViewLink = makeOutboundLink();
const GetMoreInsightsLink = makeOutboundLink();

/**
 * Wincher SEO Performance container.
 */
const WicnherSEOPerformanceContainer = styled.div`
`;

/**
 * Wincher SEO Performance top text.
 */
const WincherSEOPerformanceReportText = styled.p`
	font-size: 14px;
`;

const WincherSEOPerformanceReportHeader = styled.h3`
	margin: 8px 0;
	font-size: 1em;
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
 * Renders the 'No tracked keyphrases' message.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The message.
 */
const NoTrackedKeyphrasesMessage = ( props ) => {
	const { className, onTrackAllAction, limits } = props;

	return (
		<WincherSEOPerformanceReportText
			className={ `${ className }__text` }
		>
			{ ! isEmpty( limits ) && <WincherLimitReached limit={ limits.limit } /> }
			{ isEmpty( limits )  && <WincherNoTrackedKeyphrasesAlert /> }

			<div className={ "yoast" }>
				<NewButton
					variant={ "secondary" }
					id="yoast-wincher-dashboard-widget-track-all"
					onClick={ onTrackAllAction }
				>
					{ sprintf(
						/* translators: %s expands to Wincher */
						__( "Add your existing keyphrases to %s", "wordpress-seo" ),
						"Wincher"
					) }
				</NewButton>
			</div>
		</WincherSEOPerformanceReportText>
	);
};

NoTrackedKeyphrasesMessage.propTypes = {
	className: PropTypes.string,
	onTrackAllAction: PropTypes.func.isRequired,
	limits: PropTypes.object,
};

NoTrackedKeyphrasesMessage.defaultProps = {
	className: "",
	limits: {},
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
		<tr key={ `trackable-keyphrase-${keyword}` }>
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

	if ( ! isEmpty( data ) && data.status === 404 ) {
		return <WincherReconnectAlert
			onReconnect={ onConnectAction }
		/>;
	}

	if ( ! data || isEmpty( data.results ) ) {
		return <NoTrackedKeyphrasesMessage { ...props } />;
	}

	return null;
};

GetUserMessage.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	data: PropTypes.object,
	onConnectAction: PropTypes.func.isRequired,
};

GetUserMessage.defaultProps = {
	data: {},
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
							map( data.results, ( entry ) => {
								return <Row
									keyphrase={ entry }
									websiteId={ websiteId }
								/>;
							} )
						}
					</tbody>
				</table>
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
