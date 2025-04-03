import { SkeletonLoader } from "@yoast/ui-library";
import { ArcElement, Chart, Tooltip } from "chart.js";
import classNames from "classnames";
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
const transformScoresToGraphData = ( scores ) => ( {
	labels: scores.map( ( { name } ) => SCORE_META[ name ].label ),
	datasets: [
		{
			cutout: "82%",
			data: scores.map( ( { amount } ) => amount ),
			backgroundColor: scores.map( ( { name } ) => SCORE_META[ name ].hex ),
			borderWidth: 0,
			offset: 0,
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
		legend: false,
		tooltip: {
			displayColors: false,
			callbacks: {
				title: () => "",
				label: context => `${ context.label }: ${ context?.formattedValue }`,
			},
		},
	},
	layout: {
		padding: 5,
	},
};

/**
 * @param {string} [className] The class name.
 * @returns {JSX.Element} The element.
 */
export const ScoreChartSkeletonLoader = ( { className } ) => (
	<div className={ classNames( className, "yst-relative" ) }>
		<SkeletonLoader className="yst-w-full yst-aspect-square yst-rounded-full" />
		<div className="yst-absolute yst-inset-5 yst-aspect-square yst-bg-white yst-rounded-full" />
	</div>
);

/**
 * @param {string} [className] The class name.
 * @param {Score[]} scores The scores.
 * @returns {JSX.Element} The element.
 */
export const ScoreChart = ( { className, scores } ) => {
	return (
		<div className={ className }>
			<Doughnut
				options={ chartOptions }
				data={ transformScoresToGraphData( scores ) }
			/>
		</div>
	);
};
