import { ArcElement, Chart, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getHex, getLabels } from "../util/scores";

Chart.register( ArcElement, Tooltip );
/**
 * @type {import("../index").Scores} Scores
 */

/**
 * @param {Scores} scores The scores.
 * @returns {Object} Parsed chart data.
 */
const transformScoresToGraphData = ( scores ) => ( {
	labels: getLabels(),
	datasets: [
		{
			cutout: "82%",
			data: Object.entries( scores ).map( ( [ , { amount } ] ) => amount ),
			backgroundColor: getHex(),
			borderColor: getHex(),
			borderWidth: 1,
			offset: 1,
			hoverOffset: 5,
			spacing: 1,
			weight: 1,
			animation: {
				animateRotate: true,
			},
		},
	],
} );

const chartOptions = {
	plugins: {
		responsive: true,
		legend: false,
		tooltip: {
			displayColors: false,
			callbacks: {
				title: () => "",
				label: context => `${ context.label }: ${ context?.formattedValue }`,
			},
		},
	},
};
/**
 *
 * @param {Scores} scores The scores.
 * @returns {JSX.Element} The element.
 */
export const ScoreChart = ( { scores } )=> {
	return <div>
		<Doughnut
			options={ chartOptions }
			data={ transformScoresToGraphData( scores ) }
		/>
	</div>
	;
};
