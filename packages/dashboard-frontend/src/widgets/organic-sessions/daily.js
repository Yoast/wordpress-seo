import { __ } from "@wordpress/i18n";
import { SkeletonLoader } from "@yoast/ui-library";
import { CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { useCallback, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ErrorAlert } from "../../components/error-alert";
import { useRemoteData } from "../../services/use-remote-data";

/**
 * @type {import("../../services/data-provider")} DataProvider
 * @type {import("../../services/remote-data-provider")} RemoteDataProvider
 * @type {import("../../services/data-formatter-interface")} DataFormatterInterface
 */

/**
 * @typedef {Object} OrganicSessionsDailyData The raw organic sessions daily data.
 * @property {string} date The date.
 * @property {number} sessions The number of sessions.
 */

/**
 * @typedef {Object} ChartData
 * @property {string[]} labels The labels.
 * @property {{data: OrganicSessionsDailyData, fill: string}[]} datasets The datasets.
 */

/**
 * Register plugins:
 * - Filler: to fill the area under the line in the chart
 * - CategoryScale: needed for the X-axis (strings -- that represents dates)
 * - LinearScale: needed for the Y-axis (numbers)
 * - LineElement: to draw lines or to change how it draws?
 * - PointElement: to draw the data points?
 * - Tooltip: to have a tooltip when hovering over data points
 */
Chart.register(
	Filler,
	CategoryScale,
	LinearScale,
	LineElement,
	PointElement,
	Tooltip
);

const COLORS = {
	primary500: "rgba(166, 30, 105, 1)",
	primary500Alpha20: "rgba(166, 30, 105, 0.2)",
	primary500Alpha0: "rgba(166, 30, 105, 0)",
	slate500: "oklch(0.554 0.046 257.417)",
	slate300: "oklch(0.869 0.022 252.894)",
	slate200: "oklch(0.929 0.013 255.508)",
	transparent: "transparent",
};

// Using a memory canvas context. This prevents needing a React ref and creating these variables on-the-fly.
// Using y 225 because that is the height of the chart.
const CHART_GRADIENT = document.createElement( "canvas" )?.getContext( "2d" )?.createLinearGradient( 0, 0, 0, 225 );
CHART_GRADIENT?.addColorStop( 0, COLORS.primary500Alpha20 );
CHART_GRADIENT?.addColorStop( 1, COLORS.primary500Alpha0 );

const CHART_OPTIONS = {
	parsing: {
		xAxisKey: "date",
		yAxisKey: "sessions",
	},
	elements: {
		point: {
			radius: 5,
			borderWidth: 2,
			borderColor: "white",
			backgroundColor: COLORS.primary500,
		},
		line: {
			tension: 0.3,
			borderWidth: 3,
			borderColor: COLORS.primary500,
			backgroundColor: CHART_GRADIENT || COLORS.transparent,
		},
	},
	layout: {
		padding: {
			left: -20,
		},
	},
	scales: {
		x: {
			grid: {
				color: COLORS.slate300,
				drawTicks: false,
			},
			ticks: {
				font: {
					size: 12,
					weight: 400,
				},
				padding: 12,
				maxRotation: 0,
				// Limit the number of ticks to 14, which is half of the 28 days.
				maxTicksLimit: 14,
			},
		},
		y: {
			grid: {
				// Only show the grid line for whole numbers.
				color: ( context ) => context.tick.value % 1 ? COLORS.transparent : COLORS.slate200,
				drawTicks: false,
			},
			ticks: {
				color: COLORS.slate500,
				font: {
					size: 14,
					weight: 400,
				},
				// Set the offset for y-axis ticks.
				padding: 20,
				callback: function( value ) {
					// Only show the label for whole numbers.
					if ( value % 1 ) {
						return "";
					}
					// Format here because the chart needs the raw number to understand it.
					return this.getLabelForValue( value );
				},
			},
		},
	},
	responsive: true,
	maintainAspectRatio: false,
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
 * @param {OrganicSessionsDailyData[]} organicSessions The organic sessions data.
 * @returns {ChartData} The chart data.
 */
const transformOrganicSessionsDataToChartData = ( organicSessions ) => ( {
	labels: organicSessions.map( ( { date } ) => date ),
	datasets: [ { fill: "origin", data: organicSessions } ],
} );

/**
 * @param {DataFormatterInterface} dataFormatter The data formatter.
 * @returns {function(?OrganicSessionsDailyData[]): OrganicSessionsDailyData[]} Function to format the organic sessions daily data.
 */
const createOrganicSessionsDailyFormatter = ( dataFormatter ) => ( data = [] ) => data.map( ( item ) => ( {
	date: dataFormatter.format( item.date, "date", { widget: "organicSessions" } ),
	// We need to keep this as a number (instead of a formatted string) so the chart can understand it.
	sessions: Number( item.sessions ),
} ) );

/**
 * @param {ChartData} data The chart data.
 * @returns {JSX.Element} The chart.
 */
const OrganicSessionsChart = ( { data } ) => (
	<>
		<div className="yst-w-full yst-h-60">
			<Line
				aria-hidden={ true }
				options={ CHART_OPTIONS }
				data={ data }
			/>
		</div>
		<table className="yst-sr-only yst-table-fixed">
			<caption>{ __( "Organic sessions chart", "wordpress-seo" ) }</caption>
			<thead>
				<tr>
					{ data.labels.map( ( label ) => (
						<th key={ label }>{ label }</th>
					) ) }
				</tr>
			</thead>
			<tbody>
				<tr>
					{ data.datasets[ 0 ].data.map( ( { date, sessions } ) => (
						// Converted to a string to handle exceptions like NaN or Infinite.
						<td key={ date }>{ String( sessions ) }</td>
					) ) }
				</tr>
			</tbody>
		</table>
	</>
);

/**
 * Handles the fetch and returns the data, error and pending status.
 *
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {DataFormatterInterface} dataFormatter The data formatter.
 *
 * @returns {{data: ChartData?, error: Error, isPending: boolean}} The remote data info.
 */
export const useOrganicSessionsDaily = ( dataProvider, remoteDataProvider, dataFormatter ) => {
	/**
	 * Fetches the organic sessions daily data.
	 *
	 * @param {RequestInit} options The options.
	 *
	 * @returns {Promise<OrganicSessionsDailyData[]|Error>} The promise of OrganicSessionsData or an Error.
	 */
	const getOrganicSessionsDaily = useCallback( ( options ) => {
		const widgetName = "organicSessionsDaily";
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{
				options: { widget: widgetName },
			},
			options
		);
	}, [ dataProvider ] );

	/**
	 * Formats/prepares the request data into chart data.
	 *
	 * @type {function(?OrganicSessionsDailyData[]): ChartData} Function to format the organic sessions data into chart data.
	 */
	const formatOrganicSessionsDailyToChartData = useMemo( () => ( rawData = [] ) => {
		// 3. Transform the formatted data into chart data.
		return transformOrganicSessionsDataToChartData(
			// 1. Create a formatter.
			// 2. Format the data from the request.
			createOrganicSessionsDailyFormatter( dataFormatter )( rawData )
		);
	}, [ dataFormatter ] );

	// Combine the fetch and format methods using the remote data hook, which triggers the fetch in a useEffect.
	return useRemoteData( getOrganicSessionsDaily, formatOrganicSessionsDailyToChartData );
};

/**
 * @param {ChartData} data The chart data.
 * @param {boolean} isPending Whether the data is pending.
 * @param {?Error} [error] The error.
 * @param {string} supportLink The support link.
 * @returns {JSX.Element} The element.
 */
export const OrganicSessionsDaily = ( { data, isPending, error, supportLink } ) => {
	if ( isPending ) {
		return (
			<SkeletonLoader className="yst-w-full yst-h-52 yst-mt-8" />
		);
	}
	if ( error ) {
		return (
			<ErrorAlert className="yst-mt-4" error={ error } supportLink={ supportLink } />
		);
	}

	return (
		<OrganicSessionsChart data={ data } />
	);
};
