/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { isEmpty } from "lodash-es";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";
import { NewButton } from "@yoast/components";

/* Internal dependencies */
import WincherConnectExplanation from "./modals/WincherConnectExplanation";
import WincherNoTrackedKeyphrasesAlert from "./modals/WincherNoTrackedKeyphrasesAlert";
import { getKeyphrasePosition, generatePositionOverTimeChart } from "./WincherTableRow";

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
		"https://www.wincher.com/websites/%s/keywords?serp=%s?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast",
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
const notConnectedMessage = ( props ) => {
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

/**
 * Renders the 'No tracked keyphrases' message.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The message.
 */
const noTrackedKeyphrasesMessage = ( props ) => {
	const { className, onTrackAllAction } = props;

	return (
		<WincherSEOPerformanceReportText
			className={ `${ className }__text` }
		>
			<WincherNoTrackedKeyphrasesAlert />

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

/**
 * The Dashboard Wincer SEO Performance component.
 *
 * @param {Object} props The component props.
 *
 * @returns {wp.Element} The react component.
 */
const WincherPerformanceReport = ( props ) => {
	const { className, data, websiteId, isLoggedIn } = props;

	return (
		<WicnherSEOPerformanceContainer
			className={ className }
		>
			<WincherSEOPerformanceReportHeader
				className={ `${ className }__header` }
			>
				{ __( "Top performing keyphrases on your site", "wordpress-seo" ) }
			</WincherSEOPerformanceReportHeader>

			{ ! isLoggedIn && notConnectedMessage( props ) }
			{ isLoggedIn && ( ! data || isEmpty( data ) ) && noTrackedKeyphrasesMessage( props ) }

			{ isLoggedIn && data && ! isEmpty( data ) && <Fragment>
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
							Object.entries( data )
								.map( ( [ keyphrase, chartData ] ) => {
									return (
										<tr key={ `trackable-keyphrase-${keyphrase}` }>
											<td>{ keyphrase }</td>
											<td>{ getKeyphrasePosition( chartData ) }</td>
											<td className="yoast-table--nopadding">{ generatePositionOverTimeChart( chartData ) }</td>
											<td className="yoast-table--nobreak">
												{
													<ViewLink href={ viewLinkUrl( { websiteId, id: chartData.id } ) }>
														{ __( "View", "wordpress-seo" ) }
													</ViewLink>
												}
											</td>
										</tr>
									);
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
				</p>
			</Fragment> }

		</WicnherSEOPerformanceContainer>
	);
};

WincherPerformanceReport.propTypes = {
	className: PropTypes.string,
	data: PropTypes.object.isRequired,
	websiteId: PropTypes.string.isRequired,
	onConnectAction: PropTypes.func.isRequired,
	onTrackAllAction: PropTypes.func,
	isLoggedIn: PropTypes.bool.isRequired,
};

WincherPerformanceReport.defaultProps = {
	className: "wincher-seo-performance",
	onTrackAllAction: () => {},
};

export default WincherPerformanceReport;
