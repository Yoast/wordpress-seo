/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { isEmpty } from "lodash-es";

import AreaChart from "../AreaChart";

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
		const { data, renderAction, relatedKeyphrases } = this.props;

		return (
			<Fragment>
				{
					data && ! isEmpty( data ) && <table className="yoast-table">
						<thead>
							<tr>
								<th>{ __( "Related keyphrase", "wordpress-seo" ) }</th>
								<th>{ __( "Volume", "wordpress-seo" ) }</th>
								<th>{ __( "Trend", "wordpress-seo" ) }</th>
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
										<td>
											<AreaChart
												width={ 70 }
												height={ 30 }
												data={ chartPoints }
												strokeWidth={ 2 }
												strokeColor="#498afc"
												fillColor="#ade3fc"
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
				}
			</Fragment>
		);
	}
}

KeyphrasesTable.propTypes = {
	data: PropTypes.object,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
};

KeyphrasesTable.defaultProps = {
	data: {},
	relatedKeyphrases: [],
	renderAction: null,
};

export default KeyphrasesTable;
