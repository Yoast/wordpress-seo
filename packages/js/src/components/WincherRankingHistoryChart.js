/* External dependencies */
import { useMemo } from "@wordpress/element";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LineController,	LineElement, LinearScale, PointElement, TimeScale, Legend, Tooltip, Interaction } from "chart.js";
import "chartjs-adapter-moment";
import PropTypes from "prop-types";
import { noop } from "lodash";
import moment from "moment";
import { getRelativePosition } from "chart.js/helpers";

Chart.register( CategoryScale, LineController,	LineElement, PointElement, LinearScale, TimeScale, Legend, Tooltip );

const CHART_COLORS = [
	"#ff983b",
	"#ffa3f7",
	"#3798ff",
	"#ff3b3b",
	"#acce81",
	"#b51751",
	"#3949ab",
	"#26c6da",
	"#ccb800",
	"#de66ff",
	"#4db6ac",
	"#ffab91",
	"#45f5f1",
	"#77f210",
	"#90a4ae",
	"#ffd54f",
	"#006b5e",
	"#8ec7d2",
	"#b1887c",
	"#cc9300",
];

const MAX_Y_RANGE_FOR_INTERSECT = 10;

Interaction.modes.xPoint = ( chart, e, _, useFinalPosition ) => {
	const position = getRelativePosition( e, chart );

	let items = [];

	// Extract all items in x range with cursor.
	Interaction.evaluateInteractionItems( chart, "x", position, ( element, datasetIndex, index ) => {
		if ( element.inXRange( position.x, useFinalPosition ) ) {
			items.push( { element, datasetIndex, index } );
		}
	} );

	if ( items.length === 0 ) {
		return items;
	}

	// Extract closest x value among items in x range with cursor
	const closestX = items.reduce( ( prev, curr ) => {
		if ( Math.abs( position.x - prev.element.x ) < Math.abs( position.x - curr.element.x ) ) {
			return prev;
		}
		return curr;
	} ).element.x;

	// Return only items that have the same x value. This aims to avoid returning
	// many points within the same series if they are a lot of them e.g. on "Last year" period
	items = items.filter( ( item ) => item.element.x === closestX );

	// Return items only if one of them at least intersects with the cursor on y-axis.
	// Using intersect=true (default true) on options.interaction or options.plugins.tooltip
	// or on Interaction.evaluateInteractionItems doesn't allow to display the tooltip only when hovering on points.
	const intersect = items.some( ( item ) => Math.abs( item.element.y - position.y ) < MAX_Y_RANGE_FOR_INTERSECT );

	return intersect ? items : [];
};

/**
 * Renders the Wincher ranking history chart.
 *
 * @param {Object} props The ranking history props.
 *
 * @returns {null|wp.Element} The Wincher ranking history chart.
 */
export default function WincherRankingHistoryChart( { datasets, isChartShown, keyphrases } ) {
	if ( ! isChartShown ) {
		return null;
	}

	const colors = useMemo( () => Object.fromEntries(
		[ ...keyphrases ].sort()
			.map( ( keyphrase, index ) => [ keyphrase, CHART_COLORS[ index % CHART_COLORS.length ] ] )
	), [ keyphrases ] );

	const data = datasets.map( ( dataset ) => {
		const color = colors[ dataset.label ];
		return {
			...dataset,
			data: dataset.data.map( ( { datetime, value } ) => ( {
				x: datetime,
				y: value,
			} ) ),
			lineTension: 0,
			pointRadius: 1,
			pointHoverRadius: 4,
			borderWidth: 2,
			pointHitRadius: 6,
			backgroundColor: color,
			borderColor: color,
		};
	} ).filter( dataset => dataset.selected !== false );

	return (
		<Line
			height={ 100 }
			data={ {
				datasets: data,
			} }
			options={ {
				plugins: {
					legend: {
						display: true,
						position: "bottom",
						labels: {
							color: "black",
							usePointStyle: true,
							boxHeight: 7,
							boxWidth: 7,
						},
						onClick: noop,
					},
					tooltip: {
						enabled: true,
						callbacks: {
							title: ( x ) => moment( x[ 0 ].raw.x ).utc().format( "YYYY-MM-DD" ),
						},
						titleAlign: "center",
						mode: "xPoint",
						position: "nearest",
						usePointStyle: true,
						boxHeight: 7,
						boxWidth: 7,
						boxPadding: 2,
					},
				},
				scales: {
					x: {
						bounds: "ticks",
						type: "time",
						time: {
							unit: "day",
							minUnit: "day",
						},
						grid: {
							display: false,
						},
						ticks: {
							autoSkipPadding: 50,
							maxRotation: 0,
							color: "black",
						},
					},
					y: {
						bounds: "ticks",
						offset: true,
						reverse: true,
						ticks: {
							precision: 0,
							color: "black",
						},
						max: 101,
					},
				},
			} }
		/>
	);
}

WincherRankingHistoryChart.propTypes = {
	datasets: PropTypes.arrayOf(
		PropTypes.shape( {
			label: PropTypes.string.isRequired,
			data: PropTypes.arrayOf(
				PropTypes.shape( {
					datetime: PropTypes.string.isRequired,
					value: PropTypes.number.isRequired,
				} )
			).isRequired,
			selected: PropTypes.bool,
		} )
	).isRequired,
	isChartShown: PropTypes.bool.isRequired,
	keyphrases: PropTypes.array.isRequired,
};
