import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * Renders a table for an accessible representation of the SVG area chart.
 *
 * @param {Array} data Array of objects with X and Y coordinates for the SVG chart points.
 * @param {function} [mapChartDataToTableData=null] Function to adapt the chart points to meaningful data for the table.
 * @param {string} dataTableCaption The data table caption text.
 * @param {Array} dataTableHeaderLabels The text to be used for the data table headers.
 * @param {boolean} [isDataTableVisuallyHidden=true] Whether the data table is visually hidden.
 *
 * @returns {JSX.Element} The data table for the SVG area chart.
 */
const AreaChartTable = ( {
	data,
	mapChartDataToTableData = null,
	dataTableCaption,
	dataTableHeaderLabels,
	isDataTableVisuallyHidden = true,
} ) => {
	// All the data table headers must have text.
	if ( data.length !== dataTableHeaderLabels.length ) {
		return <p>{ __( "The number of headers and header labels don't match.", "wordpress-seo" ) }</p>;
	}

	return (
		<div
			className={ isDataTableVisuallyHidden ? "screen-reader-text" : null }
		>
			<table>
				<caption>{ dataTableCaption }</caption>
				<thead>
					<tr>
						{
							dataTableHeaderLabels.map( ( label, index ) => {
								return <th key={ index }>{ label }</th>;
							} )
						}
					</tr>
				</thead>
				<tbody>
					<tr>
						{
							data.map( ( point, index ) => {
								return <td key={ index }>{ mapChartDataToTableData( point.y ) }</td>;
							} )
						}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

AreaChartTable.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape( {
			x: PropTypes.number,
			y: PropTypes.number,
		} )
	).isRequired,
	mapChartDataToTableData: PropTypes.func,
	dataTableCaption: PropTypes.string.isRequired,
	dataTableHeaderLabels: PropTypes.array.isRequired,
	isDataTableVisuallyHidden: PropTypes.bool,
};

export default AreaChartTable;
