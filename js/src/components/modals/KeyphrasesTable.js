/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmpty } from "lodash-es";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import AreaChart from "../AreaChart";

const GetMoreInsightsLink = makeOutboundLink();

/**
 * The Related Keyphrases table component.
 */
class KeyphrasesTable extends Component {
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
	}

	/**
	 * Transform the SEMrush Trend data to x/y points for the SVG area chart.
	 *
	 * @param {Object} trend Comma separated list of Trend values.
	 *
	 * @returns {Array} An array of x/y coordinates objects.
	 */
	transformTrendDataToChartPoints( trend ) {
		const trendArray = trend.split( "," );

		return trendArray.map( ( value, index ) => ( { x: index, y: value } ) );
	}

	/**
	 * Renders the Related Keyphrases table.
	 *
	 * @returns {React.Element} The Related Keyphrases table.
	 */
	render() {
		const { keyphrase, relatedKeyphrases, data, renderAction } = this.props;
		const url = "https://www.semrush.com/analytics/keywordoverview/?q=" + encodeURIComponent( keyphrase );

		return (
			data && ! isEmpty( data ) && <Fragment>
				<table className="yoast-table">
					<thead>
						<tr>
							<th scope="col" className="yoast-table--primary">
								{ __( "Related keyphrase", "wordpress-seo" ) }
							</th>
							<th scope="col">
								{ __( "Volume", "wordpress-seo" ) }
							</th>
							<th scope="col">
								{ __( "Trend", "wordpress-seo" ) }
							</th>
							{ renderAction && <td /> }
						</tr>
					</thead>
					<tbody>
						{
							data.data.rows.map( ( row, index ) => {
								const relatedKeyphrase = row[ 0 ];
								const chartPoints = this.transformTrendDataToChartPoints( row[ 2 ] );

								return <tr key={ index }>
									<td>{ relatedKeyphrase }</td>
									<td>{ row[ 1 ] }</td>
									<td className="yoast-table--nopadding">
										<AreaChart
											width={ 70 }
											height={ 30 }
											data={ chartPoints }
											strokeWidth={ 2 }
											strokeColor="#498afc"
											fillColor="#ade3fc"
											className="yoast-related-keyphrases-modal__chart"
										/>
									</td>
									{
										renderAction && <td>
											{ renderAction( relatedKeyphrase, relatedKeyphrases ) }
										</td>
									}
								</tr>;
							} )
						}
					</tbody>
				</table>
				<p>
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

KeyphrasesTable.propTypes = {
	data: PropTypes.object,
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
};

KeyphrasesTable.defaultProps = {
	data: {},
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
};

export default KeyphrasesTable;
