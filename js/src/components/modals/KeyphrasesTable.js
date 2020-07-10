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
	}

	/**
	 * Renders the Related Keyphrases table.
	 *
	 * @returns {React.Element} The Related Keyphrases table.
	 */
	render() {
		const { data } = this.props;

		const chartData = [
			{ x: 0, y: 80 },
			{ x: 1, y: 400 },
			{ x: 2, y: 300 },
			{ x: 3, y: 100 },
			{ x: 4, y: 400 },
			{ x: 5, y: 500 },
			{ x: 6, y: 400 },
		];

		return (
			<Fragment>
				{
					data && ! isEmpty( data ) && <table className="yoast-table">
						<thead>
							<tr>
								<th>{ __( "Related keyphrase", "wordpress-seo" ) }</th>
								<th>{ __( "Volume", "wordpress-seo" ) }</th>
								<th>{ __( "Trend", "wordpress-seo" ) }</th>
								<td />
							</tr>
						</thead>
						<tbody>
							{
								data.data.rows.map( ( row, index ) => {
									return <tr key={ index }>
										<td>{ row[ 0 ] }</td>
										<td>{ row[ 1 ] }</td>
										<td>
											<AreaChart
												width={ 70 }
												height={ 30 }
												data={ chartData }
												strokeWidth={ 2 }
												strokeColor="#498afc"
												fillColor="#ade3fc"
											/>
										</td>
										<td>Fill for button</td>
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
};

KeyphrasesTable.defaultProps = {
	data: {},
};

export default KeyphrasesTable;
