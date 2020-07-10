/* External dependencies */
import PropTypes from "prop-types";

/**
 * Renders a SVG area chart.
 *
 * @param {array}  data        Array of objects with X and Y coordinates for the SVG chart points.
 * @param {number} width       The SVG chart width.
 * @param {number} height      The SVG chart height.
 * @param {string} fillColor   The SVG chart area background color in HEX format.
 * @param {string} strokeColor The SVG chart line color in HEX format.
 * @param {number} strokeWidth The SVG chart line width.
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
} ) => {
	const maximumXFromData = Math.max( ...data.map( point => point.x ) );
	const maximumYFromData = Math.max( ...data.map( point => point.y ) );

	const chartHeight = height - strokeWidth;

	const polylinePoints = data
		.map( point => {
			const x = ( point.x / maximumXFromData ) * width;
			// Add some vertical paddign to make sure the line stroke is always drawn within the SVG.
			const y = chartHeight - ( point.y / maximumYFromData ) * chartHeight + strokeWidth;

			return `${ x },${ y }`;
		} )
		.join( " " );

	// Add points to close the polygon used for the area background.
	const polygonPoints = `0,${ chartHeight } ` + polylinePoints + ` ${ width },${ chartHeight }`;

	return (
		<svg
			width={ width }
			height={ height }
			viewBox={ `0 0 ${ width } ${ height }` }
		>
			<g>
				<polygon
					fill={ fillColor }
					points={ polygonPoints }
				/>
				<polyline
					fill="none"
					stroke={ strokeColor }
					strokeWidth={ strokeWidth }
					points={ polylinePoints }
				/>
			</g>
		</svg>
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
};

AreaChart.defaultProps = {
	fillColor: null,
	strokeColor: "#000000",
	strokeWidth: 1,
};

export default AreaChart;
