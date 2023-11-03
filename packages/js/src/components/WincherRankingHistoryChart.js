/* External dependencies */
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LineController,	LineElement, LinearScale, PointElement, TimeScale, Legend, Tooltip } from "chart.js";
import "chartjs-adapter-moment";
import PropTypes from "prop-types";
import { noop } from "lodash";
import moment from "moment";

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

/**
 * Renders the Wincher ranking history chart.
 *
 * @param {Object} props The ranking history props.
 *
 * @returns {null|wp.Element} The Wincher ranking history chart.
 */
export default function WincherRankingHistoryChart( { datasets, isChartShown } ) {
	if ( ! isChartShown ) {
		return null;
	}

	const data = datasets.map( ( dataset, index ) => {
		const color = CHART_COLORS[ index % CHART_COLORS.length ];
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
						intersect: false,
						mode: "point",
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
};
