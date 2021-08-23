import {Component, Fragment, useCallback} from "@wordpress/element";
import PropTypes from "prop-types";
import {Toggle} from "@yoast/components";
import {__, _n, sprintf} from "@wordpress/i18n";
import {makeOutboundLink} from "@yoast/helpers";
import AreaChart from "./AreaChart";
import WincherKeyphrasesTable from "./WincherKeyphrasesTable";
import {isEmpty} from "lodash-es";

const ViewLink = makeOutboundLink();

/**
 * Transforms the Wincher Position data to x/y points for the SVG area chart.
 *
 * @param {Array} trend List of position values for a single keyphrase.
 *
 * @returns {Array} An array of x/y coordinates objects.
 */
function transformTrendDataToChartPoints( trend ) {
	return trend.map( ( entry, index ) => ( { x: index, y: 101 - entry.value } ) );
}

/**
 * Gets the labels for the data table headers.
 *
 * @returns {Array} The data table header labels.
 */
function getAreaChartDataTableHeaderLabels() {
	return Array.from( { length: 90 }, ( _, i ) => i + 1 ).map( ( i ) => {
		/* translators: %d expands to the amount of days */
		return sprintf( _n( "%d day", "%d days", i, "wordpress-seo" ), i );
	} );
}

/**
 * Adapts the chart y axis data to a more meaningful format for the alternative representation in the data table.
 *
 * @param {number} y The raw y axis data of the chart.
 *
 * @returns {number} The formatted y axis data.
 */
function mapAreaChartDataToTableData( y ) {
	return Math.round( y * 100 );
}


/**
 *  Generates a chart based on the passed data.
 *
 * @param {Object} rowData The data entry to check for data points.
 *
 * @returns {wp.Element|string} The chart containing the positions over time. If there is none, return "?".
 */
function generatePositionOverTimeChart( rowData ) {
	if ( isEmpty( rowData ) || isEmpty( rowData.chartData ) ) {
		return "?";
	}

	const areaChartDataTableHeaderLabels = getAreaChartDataTableHeaderLabels();
	const chartPoints = transformTrendDataToChartPoints( rowData.chartData );

	return <AreaChart
		width={ 66 }
		height={ 24 }
		data={ chartPoints }
		strokeWidth={ 1.8 }
		strokeColor="#498afc"
		fillColor="#ade3fc"
		className="yoast-related-keyphrases-modal__chart"
		mapChartDataToTableData={ mapAreaChartDataToTableData }
		dataTableCaption={
			__( "Keyphrase position in the last 90 days on a scale from 0 to 100.", "wordpress-seo" )
		}
		dataTableHeaderLabels={ areaChartDataTableHeaderLabels }
	/>;
}


/**
 * Gets the toggles state of the keyphrase.
 *
 * @param {string}  keyphrase The toggle's associated keyphrase.
 * @param {boolean} isEnabled Whether or not the toggle is enabled.
 * @param {function} toggleAction The toggle action to call.
 *
 * @returns {wp.Element} The toggle component.
 */
export function renderToggleState( { keyphrase, isEnabled, toggleAction } ) {
	return (
		<Toggle
			id={ `toggle-keyphrase-tracking-${keyphrase}` }
			className="wincher-toggle"
			isEnabled={ isEnabled }
			onSetToggleState={ toggleAction }
			showToggleStateLabel={ false }
		/>
	);
}

/**
 * Gets the keyphrase position.
 *
 * @param {Object} rowData The row data to extract the keyphrase position from.
 *
 * @returns {string} The keyphrase position. Returns a "?" if no data is present.
 */
export function getKeyphrasePosition( rowData ) {
	if ( isEmpty( rowData ) || isEmpty( rowData.chartData ) || rowData.position > 100 ) {
		return "?";
	}

	return rowData.position;
}

/**
 * The WincherTableRow component.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.element} The component.
 * @constructor
 */
export default function WincherTableRow( props ) {
	const {
		keyphrase,
		rowData,
		allowToggling,
		onTrackKeyphrase,
	} = props;

	const trackableKeyphrase = keyphrase;
	const isEnabled          = ! isEmpty( rowData );

	const toggleAction = useCallback(
		() => {
			( async() => {
				await onTrackKeyphrase( trackableKeyphrase );
			} )();
		},
		[ trackableKeyphrase, onTrackKeyphrase ]
	);

	return <tr>
		{ allowToggling && <td>{ renderToggleState( { keyphrase, isEnabled, toggleAction } ) }</td> }
		<td>{ trackableKeyphrase }</td>
		<td>{ getKeyphrasePosition( rowData ) }</td>
		<td className="yoast-table--nopadding">{ generatePositionOverTimeChart( rowData ) }</td>
		<td className="yoast-table--nobreak">
			{
				<ViewLink href={ `https://google.com?q=${trackableKeyphrase}` }>
					{ __( "View", "wordpress-seo" ) }
				</ViewLink>
			}
		</td>
	</tr>;
}

WincherTableRow.propTypes = {
	trackedKeyphrases: PropTypes.array,
	allowToggling: PropTypes.bool,
	rowData: PropTypes.array.isRequired,
	onTrackKeyphrase: PropTypes.func.isRequired,
};

WincherTableRow.defaultProps = {
	trackedKeyphrases: [],
	allowToggling: true,
};
