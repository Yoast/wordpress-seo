import React, { Fragment } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import TrendGraphTable from "./TrendGraphTable";

/**
 * Renders a SVG area chart.
 *
 * @param {array}    data                      Array of objects with X and Y coordinates for the SVG chart points.
 * @param {number}   width                     The SVG chart width.
 * @param {number}   height                    The SVG chart height.
 * @param {string}   fillColor                 The SVG chart area background color in HEX format.
 * @param {string}   strokeColor               The SVG chart line color in HEX format.
 * @param {number}   strokeWidth               The SVG chart line width.
 *
 * @returns {JSX.Element} The SVG area chart component.
 */
const TrendGraph = ( {
	data,
	width = 66,
	height = 24,
	fillColor = "#ade3fc",
	strokeColor = "#498afc",
	strokeWidth = 1.8,
} ) => {
	// When all the x values are zero, make sure the maximumX value is at least 1 to avoid a division by zero later.
	const maximumXFromData = Math.max( 1, Math.max( ...data.map( point => point.x ) ) );
	// When all the y values are zero, make sure the maximumY value is at least 1 to avoid a division by zero later.
	const maximumYFromData = Math.max( 1, Math.max( ...data.map( point => point.y ) ) );

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
				width={ 66 }
				height={ 24 }
				viewBox={ "0 0 66 24" }
				className="yst-block"
				role="img"
				aria-hidden="true"
				focusable="false"
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

			<TrendGraphTable data={ data } />

		</Fragment>
	);
};

TrendGraph.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape( {
			x: PropTypes.number,
			y: PropTypes.number,
		} ),
	).isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	fillColor: PropTypes.string,
	strokeColor: PropTypes.string,
	strokeWidth: PropTypes.number,
};

export default TrendGraph;
