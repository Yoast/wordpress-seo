/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __, sprintf, _n } from "@wordpress/i18n";
import { isEmpty } from "lodash-es";

/* Yoast dependencies */
import { Toggle } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import AreaChart from "../AreaChart";

const GetMoreInsightsLink = makeOutboundLink();
const ViewLink = makeOutboundLink();

/**
 * The WincherKeyphrasesTable component.
 */
class WincherKeyphrasesTable extends Component {
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
		this.getToggleState = this.getToggleState.bind( this );
	}

	/**
	 * Transforms the Wincher Position data to x/y points for the SVG area chart.
	 *
	 * @param {Object} trend Comma separated list of position values for a single keyphrase.
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
		return Array.from( { length: 90 }, ( _, i ) => i + 1 ).map( ( i ) => {
			/* translators: %d expands to the amount of days */
			return sprintf( _n( "%d day", "%d days", i, "wordpress-seo" ), i );
		} );
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
	 * Gets the toggles state of the keyphrase.
	 *
	 * @param {string} keyphrase The toggle's associated keyphrase.
	 * @param {boolean} isEnabled Whether or not the toggle is enabled.
	 *
	 * @returns {wp.Element} The toggle component.
	 */
	getToggleState( keyphrase, isEnabled ) {
		return (
			<Toggle
				id={ `toggle-keyphrase-tracking-${keyphrase}` }
				className={ "wincher-toggle" }
				isEnabled={ isEnabled }
				onSetToggleState={ () => {
					this.props.toggleAction( keyphrase );
				} }
				showToggleStateLabel={ false }
			/>
		);
	}

	/**
	 *  Generates a chart based on the passed data.
	 *
	 * @param {Object} entry The data entry to check for data points.
	 *
	 * @returns {wp.Element} The chart containing the positions over time.
	 */
	generatePositionOverTimeChart( entry ) {
		const areaChartDataTableHeaderLabels = this.getAreaChartDataTableHeaderLabels();
		const chartPoints = this.transformTrendDataToChartPoints( entry );

		return <AreaChart
			width={ 66 }
			height={ 24 }
			data={ chartPoints }
			strokeWidth={ 1.8 }
			strokeColor="#498afc"
			fillColor="#ade3fc"
			className="yoast-related-keyphrases-modal__chart"
			mapChartDataToTableData={ this.mapAreaChartDataToTableData }
			dataTableCaption={
				__( "Keyphrase position in the last 90 days on a scale from 0 to 100.", "wordpress-seo" )
			}
			dataTableHeaderLabels={ areaChartDataTableHeaderLabels }
		/>;
	}

	/**
	 * Renders the table.
	 *
	 * @returns {React.Element} The table.
	 */
	render() {
		const { keyphrases, data, trackedKeyphrases, allowToggling } = this.props;

		return (
			data && ! isEmpty( data.results ) && <Fragment>
				<table className="yoast yoast-table">
					<thead>
						<tr>
							{ allowToggling && <th
								scope="col"
								abbr={ __( "Tracking", "wordpress-seo" ) }
							>
								{ __( "Tracking", "wordpress-seo" ) }
							</th> }
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
							data.results.rows.map( ( row, index ) => {
								const trackableKeyphrase = row[ 1 ];
								const isTracked          = trackedKeyphrases.includes( trackableKeyphrase );

								return <tr key={ `trackable-keyphrase-${index}` }>
									{ allowToggling &&  <td>{ this.getToggleState( trackableKeyphrase, isTracked ) }</td> }
									<td>{ trackableKeyphrase }</td>
									<td>{ isTracked ? row[ 2 ] : "?" }</td>
									<td className="yoast-table--nopadding">{ isTracked ? this.generatePositionOverTimeChart( row[ 3 ] ) : "?" }</td>
									<td className="yoast-table--nobreak">
										{
											<ViewLink href={ `https://google.com?q=${trackableKeyphrase}` }>
												{ __( "View", "wordpress-seo" ) }
											</ViewLink>
										}
									</td>
								</tr>;
							} )
						}
					</tbody>
				</table>
				<p style={ { marginBottom: 0 } }>
					<GetMoreInsightsLink href={ "https://google.com" }>
						{ sprintf(
							/* translators: %s expands to Wincher */
							__( "Get more insights over at %s", "wordpress-seo" ),
							"Wincher"
						) }
					</GetMoreInsightsLink>
				</p>
			</Fragment>
		);
	}
}

WincherKeyphrasesTable.propTypes = {
	data: PropTypes.object,
	keyphrases: PropTypes.array,
	trackedKeyphrases: PropTypes.array,
	toggleAction: PropTypes.func,
	allowToggling: PropTypes.bool,
};

WincherKeyphrasesTable.defaultProps = {
	data: {},
	keyphrases: [],
	trackedKeyphrases: [],
	toggleAction: null,
	allowToggling: true,
};

export default WincherKeyphrasesTable;
