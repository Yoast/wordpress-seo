/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmpty } from "lodash-es";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import AreaChart from "../AreaChart";
import HelpLink from "../HelpLink";

const GetMoreInsightsLink = makeOutboundLink();

/**
 * The SEMrushKeyphrasesTable component.
 */
class SEMrushKeyphrasesTable extends Component {
	/**
	 * Constructs the Related Keyphrases table.
	 *
	 * @param {Object} props The props for the Related Keyphrases table.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.transformTrendDataToChartPoints = this.transformTrendDataToChartPoints.bind( this );
		this.getAreaChartDataTableHeaderLabels = this.getAreaChartDataTableHeaderLabels.bind( this );
		this.mapAreaChartDataToTableData = this.mapAreaChartDataToTableData.bind( this );
	}

	/**
	 * Transforms the SEMrush Trend data to x/y points for the SVG area chart.
	 *
	 * @param {Object} trend Comma separated list of Trend values for a single keyphrase..
	 *
	 * @returns {Array} An array of x/y coordinates objects.
	 */
	transformTrendDataToChartPoints( trend ) {
		const trendArray = trend.split( "," );

		return trendArray.map( ( value, index ) => ( { x: index, y: parseFloat( value ) } ) );
	}

	/**
	 * Gets the labels for the data table headers.
	 *
	 * @returns {Array} The data table header labels.
	 */
	getAreaChartDataTableHeaderLabels() {
		return [
			__( "Twelve months ago", "wordpress-seo" ),
			__( "Eleven months ago", "wordpress-seo" ),
			__( "Ten months ago", "wordpress-seo" ),
			__( "Nine months ago", "wordpress-seo" ),
			__( "Eight months ago", "wordpress-seo" ),
			__( "Seven months ago", "wordpress-seo" ),
			__( "Six months ago", "wordpress-seo" ),
			__( "Five months ago", "wordpress-seo" ),
			__( "Four months ago", "wordpress-seo" ),
			__( "Three months ago", "wordpress-seo" ),
			__( "Two months ago", "wordpress-seo" ),
			__( "Last month", "wordpress-seo" ),
		];
	}

	/**
	 * Adapts the chart y axis data to a more meaningful format for the alternative representation in the data table.
	 *
	 * @param {number} y The raw y axis data of the chart.
	 *
	 * @returns {number} The formatted y axis data.
	 */
	mapAreaChartDataToTableData( y ) {
		return Math.round( y * 100 );
	}

	/**
	 * Renders the Related Keyphrases table.
	 *
	 * @returns {React.Element} The Related Keyphrases table.
	 */
	render() {
		const { keyphrase, relatedKeyphrases, countryCode, data, renderAction } = this.props;
		const url = "https://www.semrush.com/analytics/keywordoverview/?q=" + encodeURIComponent( keyphrase ) +
			"&db=" + encodeURIComponent( countryCode );

		return (
			data && ! isEmpty( data.results ) && <Fragment>
				<table className="yoast yoast-table">
					<thead>
						<tr>
							<th
								scope="col"
								className="yoast-table--primary"
							>
								{ __( "Related keyphrase", "wordpress-seo" ) }
							</th>
							<th
								scope="col"
								abbr={ __( "Volume", "wordpress-seo" ) }
							>
								{ __( "Volume", "wordpress-seo" ) }
								<HelpLink
									href={ window.wpseoAdminL10n[ "shortlinks.semrush.volume_help" ] }
									className="dashicons"
								>
									<span className="screen-reader-text">
										{ __( "Learn more about the related keyphrases volume", "wordpress-seo" ) }
									</span>
								</HelpLink>
							</th>
							<th
								scope="col"
								abbr={ __( "Trend", "wordpress-seo" ) }
							>
								{ __( "Trend", "wordpress-seo" ) }
								<HelpLink
									href={ window.wpseoAdminL10n[ "shortlinks.semrush.trend_help" ] }
									className="dashicons"
								>
									<span className="screen-reader-text">
										{ __( "Learn more about the related keyphrases trend", "wordpress-seo" ) }
									</span>
								</HelpLink>
							</th>
							{ renderAction && <td className="yoast-table--nobreak" /> }
						</tr>
					</thead>
					<tbody>
						{
							data.results.rows.map( ( row, index ) => {
								const relatedKeyphrase = row[ 0 ];
								const chartPoints = this.transformTrendDataToChartPoints( row[ 2 ] );
								const areaChartDataTableHeaderLabels = this.getAreaChartDataTableHeaderLabels();

								return <tr key={ index }>
									<td>{ relatedKeyphrase }</td>
									<td>{ row[ 1 ] }</td>
									<td className="yoast-table--nopadding">
										<AreaChart
											width={ 66 }
											height={ 24 }
											data={ chartPoints }
											strokeWidth={ 1.8 }
											strokeColor="#498afc"
											fillColor="#ade3fc"
											className="yoast-related-keyphrases-modal__chart"
											mapChartDataToTableData={ this.mapAreaChartDataToTableData }
											dataTableCaption={
												__( "Keyphrase volume in the last 12 months on a scale from 0 to 100.", "wordpress-seo" )
											}
											dataTableHeaderLabels={ areaChartDataTableHeaderLabels }
										/>
									</td>
									{
										renderAction && <td className="yoast-table--nobreak">
											{ renderAction( relatedKeyphrase, relatedKeyphrases ) }
										</td>
									}
								</tr>;
							} )
						}
					</tbody>
				</table>
				<p style={ { marginBottom: 0 } }>
					<GetMoreInsightsLink href={ url }>
						{ sprintf(
							/* translators: %s expands to SEMrush */
							__( "Get more insights at %s", "wordpress-seo" ),
							"SEMrush"
						) }
					</GetMoreInsightsLink>
				</p>
			</Fragment>
		);
	}
}

SEMrushKeyphrasesTable.propTypes = {
	data: PropTypes.object,
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	countryCode: PropTypes.string,
	renderAction: PropTypes.func,
};

SEMrushKeyphrasesTable.defaultProps = {
	data: {},
	keyphrase: "",
	relatedKeyphrases: [],
	countryCode: "us",
	renderAction: null,
};

export default SEMrushKeyphrasesTable;
