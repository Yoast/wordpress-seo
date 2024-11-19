import { ArcElement, Chart, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { SCORE_META } from "../score-meta";

/**
 * @type {import("../index").Score} Score
 */

Chart.register( ArcElement, Tooltip );

/**
 * @param {Score[]} scores The scores.
 * @returns {Object} Parsed chart data.
 */
const transformScoresToGraphData = ( scores ) => {
	const hexes = scores.map( ( { name } ) => SCORE_META[ name ].hex );

	return {
		labels: scores.map( ( { name } ) => SCORE_META[ name ].label ),
		datasets: [
			{
				cutout: "82%",
				data: scores.map( ( { amount } ) => amount ),
				backgroundColor: hexes,
				borderColor: hexes,
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
	};
};

const chartOptions = {
	plugins: {
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
 * @param {Score[]} scores The scores.
 * @returns {JSX.Element} The element.
 */
export const ScoreChart = ( { scores } ) => {
	return (
		<div className="yst-col-span-3">
			<Doughnut
				options={ chartOptions }
				data={ transformScoresToGraphData( scores ) }
			/>
		</div>
	);
};
