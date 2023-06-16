/* External dependencies */
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LineController,	LineElement, LinearScale, PointElement } from "chart.js";
import PropTypes from "prop-types";

Chart.register( CategoryScale, LineController,	LineElement, PointElement, LinearScale );

/**
 * Renders the Wincher SEO Performance modal content.
 *
 * @param {Object} props The props to use within the content.
 *
 * @returns {wp.Element} The Wincher SEO Performance modal content.
 */
export default function LineChart( { data } ) {
	return (
		<Line
			height={ 75 }
			data={ {
				datasets: [ {
					data: data.map( ( { datetime, value } ) => ( {
						x: datetime,
						y: value,
					} ) ),
					borderColor: "#7CB5EC",
					backgroundColor: "#E5F0FB",
					lineTension: 0,
					pointRadius: 0,
					pointHoverRadius: 0,
				} ],
			} }
			options={ {
				tooltips: {
					enabled: false,
				},
				legend: {
					display: false,
				},
				scales: {
					xAxes: [ {
						gridLines: {
						  color: "rgba(0, 0, 0, 0)",
						},
						ticks: {
						  display: false,
						},
						type: "time",
						time: {
						  unit: "day",
						},
					} ],
					yAxes: [ {
						ticks: {
							display: false,
						},
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						},
					} ],
				},
			} }
		/>
	);
}

LineChart.propTypes = {
	data: PropTypes.array.isRequired,
};
