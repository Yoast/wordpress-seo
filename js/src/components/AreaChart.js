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
	className,
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
};

AreaChart.defaultProps = {
	fillColor: null,
	strokeColor: "#000000",
	strokeWidth: 1,
	className: "",
};

export default AreaChart;
