/* External dependencies */
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LineController,	LineElement, LinearScale, PointElement, TimeScale, Colors, Legend } from "chart.js";
import "chartjs-adapter-moment";
import PropTypes from "prop-types";
import { noop } from "lodash";

Chart.register( CategoryScale, LineController,	LineElement, PointElement, LinearScale, TimeScale, Colors, Legend );

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

	const data = datasets.map( dataset => ( {
		...dataset,
		data: dataset.data.map( ( { datetime, value } ) => ( {
			x: datetime,
			y: value,
		} ) ),
		lineTension: 0,
		pointRadius: 0,
		pointHoverRadius: 0,
		borderWidth: 2,
	} ) );

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
		} )
	).isRequired,
	isChartShown: PropTypes.bool.isRequired,
};
