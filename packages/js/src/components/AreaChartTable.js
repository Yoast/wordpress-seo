import { __ } from "@wordpress/i18n";

/**
 * Renders a table for an accessible representation of the SVG area chart.
 *
 * @param {Object} props Component props.
 * @param {Object[]} props.data Array of objects with X and Y coordinates for the SVG chart points.
 * @param {number} [props.data[].x] The X coordinate of the point.
 * @param {number} [props.data[].y] The Y coordinate of the point.
 * @param {Function} [props.mapChartDataToTableData=null] Function to adapt the chart points to meaningful data for the table.
 * @param {string} props.dataTableCaption The data table caption text.
 * @param {Array} props.dataTableHeaderLabels The text to be used for the data table headers.
 * @param {boolean} [props.isDataTableVisuallyHidden=true] Whether the data table is visually hidden.
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

export default AreaChartTable;
