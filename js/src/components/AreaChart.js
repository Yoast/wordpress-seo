/* External dependencies */
import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";

/**
 * Renders a SVG area chart.
 *
 * @param {array}  data        Array of objects with X and Y coordinates for the SVG chart points.
 * @param {number} width       The SVG chart width.
 * @param {number} height      The SVG chart height.
 * @param {string} fillColor   The SVG chart area background color in HEX format.
 * @param {string} strokeColor The SVG chart line color in HEX format.
 * @param {number} strokeWidth The SVG chart line width.
 * @param {string} className   The CSS class name for the chart.
 *
 * @returns {wp.Element} The SVG area chart component.
 */
const AreaChart = ( {
	data,
	width,
	height,
	fillColor,
	strokeColor,
	strokeWidth,
	className,
	mapChartDataToTableData,
	dataTableCaption,
	dataTableHeaderLabels,
	isDataTableVisuallyHidden,
} ) => {
	const maximumXFromData = Math.max( ...data.map( point => point.x ) );
	const maximumYFromData = Math.max( ...data.map( point => point.y ) );

	// Reserve some vertical spacing to prevent the SVG stroke from being cut-off.
	const chartHeight = height - strokeWidth;

	const polylinePoints = data
		.map( point => {
			const x = ( point.x / maximumXFromData ) * width;
			// Add some vertical padding to make sure the line stroke is always drawn within the SVG.
			const y = chartHeight - ( point.y / maximumYFromData ) * chartHeight + strokeWidth;

			return `${ x },${ y }`;
		} )
		.join( " " );

	// Add points to close the polygon used for the area background.
	const polygonPoints = `0,${ chartHeight + strokeWidth } ` + polylinePoints + ` ${ width },${ chartHeight + strokeWidth }`;

	return (
		<Fragment>
			<svg
				width={ width }
				height={ height }
				viewBox={ `0 0 ${ width } ${ height }` }
				className={ className }
			>
				<polygon
					fill={ fillColor }
					points={ polygonPoints }
				/>
				<polyline
					fill="none"
					stroke={ strokeColor }
					strokeWidth={ strokeWidth }
					strokeLinejoin="round"
					strokeLinecap="round"
					points={ polylinePoints }
				/>
			</svg>
			{
				mapChartDataToTableData &&
				<table
					className={ isDataTableVisuallyHidden ? "screen-reader-text" : null }
				>
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
			}
		</Fragment>
	);
};

AreaChart.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape( {
			x: PropTypes.number,
			y: PropTypes.number,
		} )
	).isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	fillColor: PropTypes.string,
	strokeColor: PropTypes.string,
	strokeWidth: PropTypes.number,
	className: PropTypes.string,
	mapChartDataToTableData: PropTypes.func,
	dataTableCaption: PropTypes.string.isRequired,
	dataTableHeaderLabels: PropTypes.array,
	isDataTableVisuallyHidden: PropTypes.bool,
};

AreaChart.defaultProps = {
	fillColor: null,
	strokeColor: "#000000",
	strokeWidth: 1,
	className: "",
	mapChartDataToTableData: null,
	dataTableHeaderLabels: [],
	isDataTableVisuallyHidden: true,
};

export default AreaChart;
