import React from "react";
import PropTypes from "prop-types";
import { TrendGraphScreenReader } from "./TrendGraphScreenReader";

/**
 * Renders a SVG area chart.
 *
 * @param {array} data Array of objects with X and Y coordinates for the SVG chart points.
 *
 * @returns {JSX.Element} The SVG area chart component.
 */
export const TrendGraph = ( { data } ) => {
	const width = 66;
	const height = 24;
	const strokeWidth = 1.8;

	if ( data.length !== 12 ) {
		const missingLength = 12 - data.length;

		for ( let i = 0; i < missingLength; i++ ) {
			data.unshift( 0 );
		}
	}

	// When all the y values are zero, make sure the maximumY value is at least 1 to avoid a division by zero later.
	const maximumYFromData = Math.max( 1, ...data.map( point => point ) );

	// Reserve some vertical spacing to prevent the SVG stroke from being cut-off.
	const chartHeight = height - strokeWidth;

	const polylinePoints = data
		.map( ( point, index ) => {
			const x = ( index / 11 ) * width;
			// Add some vertical padding to make sure the line stroke is always drawn within the SVG.
			const y = chartHeight - ( point / maximumYFromData ) * chartHeight + strokeWidth;

			return `${ x },${ y }`;
		} )
		.join( " " );

	// Add points to close the polygon used for the area background.
	const polygonPoints = `0,${ chartHeight + strokeWidth } ` + polylinePoints + ` ${ width },${ chartHeight + strokeWidth }`;

	return (
		<>
			<svg
				width={ width }
				height={ height }
				viewBox={ `0 0 ${ width } ${ height }` }
				className="yst-block"
				role="img"
				aria-hidden="true"
				focusable="false"
			>
				<polygon
					className="yst-fill-sky-200"
					points={ polygonPoints }
				/>
				<polyline
					fill="none"
					className="yst-stroke-blue-500"
					strokeWidth={ strokeWidth }
					strokeLinejoin="round"
					strokeLinecap="round"
					points={ polylinePoints }
				/>
			</svg>

			<TrendGraphScreenReader data={ data } />

		</>
	);
};

TrendGraph.propTypes = {
	data: PropTypes.arrayOf( PropTypes.number ).isRequired,
};
