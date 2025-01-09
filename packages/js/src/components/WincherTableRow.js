/* External dependencies */
import PropTypes from "prop-types";
import { useCallback, Fragment } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { isEmpty } from "lodash";
import moment from "moment";

/* Yoast dependencies */
import { Checkbox, SvgIcon, Toggle, ButtonStyledLink } from "@yoast/components";

/* Internal dependencies */
import AreaChart from "./AreaChart";
import WincherSEOPerformanceLoading from "./modals/WincherSEOPerformanceLoading";
import styled from "styled-components";

export const CaretIcon = styled( SvgIcon )`
	margin-left: 2px;
	flex-shrink: 0;
	rotate: ${ props => props.isImproving ? "-90deg" : "90deg" };
`;

export const PositionChangeValue = styled.span`
	color: ${ props => props.isImproving ? "#69AB56" : "#DC3332" };
	font-size: 13px;
	font-weight: 600;
	line-height: 20px;
	margin-right: 2px;
	margin-left: 12px;
`;

export const SelectKeyphraseCheckboxWrapper = styled.td`
	padding-right: 0 !important;

	& > div {
		margin: 0px;
	}
`;

export const KeyphraseTdWrapper = styled.td`
	padding-left: 2px !important;
`;

export const TrackingTdWrapper = styled.td.attrs( { className: "yoast-table--nopadding" } )`
	& > div {
		justify-content: center;
	}
`;

const PositionAndViewLinkWrapper = styled.div`
	display: flex;
	align-items: center;
	& > a {
		box-sizing: border-box;
	}
`;

const PositionOverTimeButton = styled.button`
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
    display: flex;
    align-items: center;
`;

const WincherTableRowElement = styled.tr`
	background-color: ${ props => props.isEnabled ? "#FFFFFF" : "#F9F9F9" } !important;
`;

/**
 * Transforms the Wincher Position data to x/y points for the SVG area chart.
 *
 * @param {Object} chartEntry List of position values for a single keyphrase.
 *
 * @returns {Array} An array of x/y coordinates objects.
 */
export function transformTrendDataToChartPoints( chartEntry ) {
	return chartEntry.position.history.map( ( entry, index ) => ( { x: index, y: 101 - entry.value } ) );
}

/**
 * Gets the labels for the data table headers.
 *
 * @param {Object} chartData The chart data to map.
 *
 * @returns {Array} The data table header labels.
 */
export function getAreaChartDataTableHeaderLabels( chartData ) {
	return Array.from( { length: chartData.position.history.length }, ( _, i ) => i + 1 ).map( ( i ) => {
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
export function mapAreaChartDataToTableData( y ) {
	return Math.round( y * 100 );
}


/**
 *  Generates a chart based on the passed data.
 *
 * @param {Object} chartData The chart data entry.
 *
 * @returns {wp.Element|string} The chart containing the positions over time. If there is none, return "?".
 */
export function PositionOverTimeChart( { chartData } ) {
	if ( isEmpty( chartData ) || isEmpty( chartData.position ) ) {
		return "?";
	}

	const areaChartDataTableHeaderLabels = getAreaChartDataTableHeaderLabels( chartData );
	const chartPoints = transformTrendDataToChartPoints( chartData );

	return <AreaChart
		width={ 66 }
		height={ 24 }
		data={ chartPoints }
		strokeWidth={ 1.8 }
		strokeColor="#498afc"
		fillColor="#ade3fc"
		mapChartDataToTableData={ mapAreaChartDataToTableData }
		dataTableCaption={
			__( "Keyphrase position in the last 90 days on a scale from 0 to 100.", "wordpress-seo" )
		}
		dataTableHeaderLabels={ areaChartDataTableHeaderLabels }
	/>;
}

PositionOverTimeChart.propTypes = {
	chartData: PropTypes.object,
};

PositionOverTimeChart.defaultProps = {
	chartData: {},
};

/**
 * Gets the toggles state of the keyphrase.
 *
 * @param {string}   keyphrase The toggle's associated keyphrase.
 * @param {boolean}  isEnabled Whether or not the toggle is enabled.
 * @param {function} toggleAction The toggle action to call.
 * @param {function} isLoading Whether or not we're still loading initial data.
 *
 * @returns {wp.Element} The toggle component.
 */
export function renderToggleState( { keyphrase, isEnabled, toggleAction, isLoading } ) {
	if ( isLoading ) {
		return <SvgIcon icon="loading-spinner" />;
	}

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
 * @param {Object} keyphrase The keyphrase data to extract the position from.
 *
 * @returns {string} The keyphrase position.
 */
export function getKeyphrasePosition( keyphrase ) {
	if ( ! keyphrase || ! keyphrase.position || keyphrase.position.value > 100 ) {
		return "> 100";
	}

	return keyphrase.position.value;
}

/**
 * Humanize the last updated date string
 *
 * @param {string} dateString The date string to format.
 *
 * @returns {string} The formatted last updated date.
 */
const formatLastUpdated = ( dateString ) => moment( dateString ).fromNow();

/**
 * Displays the position over time cell.
 *
 * @param {object} rowData The position over time data.
 *
 * @returns {wp.Element} The position over time table cell.
 */
export const PositionOverTimeCell = ( { rowData } ) => {
	if ( ! rowData?.position?.change ) {
		return <PositionOverTimeChart chartData={ rowData } />;
	}

	const isImproving = rowData.position.change < 0;
	return (
		<Fragment>
			<PositionOverTimeChart chartData={ rowData } />
			<PositionChangeValue isImproving={ isImproving }>{ Math.abs( rowData.position.change ) }</PositionChangeValue>
			<CaretIcon
				icon={ "caret-right" }
				color={ isImproving ? "#69AB56" : "#DC3332" }
				size={ "14px" } isImproving={ isImproving }
			/>
		</Fragment>
	);
};

PositionOverTimeCell.propTypes = {
	rowData: PropTypes.object,
};

/**
 * Gets the positional data based on the current UI state and returns the appropiate UI element.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The rendered element.
 */
export function getPositionalDataByState( props ) {
	const { rowData, websiteId, keyphrase, onSelectKeyphrases } = props;

	/**
	 * Fires when click on position over time
	 *
	 * @returns {void}
	 */
	const onPositionOverTimeClick = useCallback( () => {
		onSelectKeyphrases( [ keyphrase ] );
	}, [ onSelectKeyphrases, keyphrase ] );

	const isEnabled          = ! isEmpty( rowData );
	const hasFreshData = rowData && rowData.updated_at && moment( rowData.updated_at ) >= moment().subtract( 7, "days" );
	const viewLinkURL        = ( rowData ) ? sprintf(
		"https://app.wincher.com/websites/%s/keywords?serp=%s&utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast",
		websiteId,
		rowData.id
	) : null;

	if ( ! isEnabled ) {
		return (
			<td className="yoast-table--nopadding" colSpan="3">
				<i>{ __( "Activate tracking to show the ranking position", "wordpress-seo" ) }</i>
			</td>
		);
	}
	if ( ! hasFreshData ) {
		return (
			<td className="yoast-table--nopadding" colSpan="3">
				<WincherSEOPerformanceLoading />
			</td>
		);
	}

	return (
		<Fragment>
			<td>
				<PositionAndViewLinkWrapper>
					{ getKeyphrasePosition( rowData ) }
					<ButtonStyledLink variant="secondary" href={ viewLinkURL } style={ { height: 28, marginLeft: 12 } } rel="noopener" target="_blank">
						{ __( "View", "wordpress-seo" ) }
					</ButtonStyledLink>
				</PositionAndViewLinkWrapper>
			</td>
			<td className="yoast-table--nopadding">
				<PositionOverTimeButton type="button" onClick={ onPositionOverTimeClick }>
					<PositionOverTimeCell rowData={ rowData } />
				</PositionOverTimeButton>
			</td>
			<td>{ formatLastUpdated( rowData.updated_at ) }</td>
		</Fragment>
	);
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
		onTrackKeyphrase,
		onUntrackKeyphrase,
		isFocusKeyphrase,
		isDisabled,
		isLoading,
		isSelected,
		onSelectKeyphrases,
	} = props;

	const isEnabled  = ! isEmpty( rowData );

	const hasHistory = ! isEmpty( rowData?.position?.history );

	const toggleAction = useCallback(
		() => {
			if ( isDisabled ) {
				return;
			}

			if ( isEnabled ) {
				onUntrackKeyphrase( keyphrase, rowData.id );
			} else {
				onTrackKeyphrase( keyphrase );
			}
		},
		[ keyphrase, onTrackKeyphrase, onUntrackKeyphrase, isEnabled, rowData, isDisabled ]
	);

	/**
	 * Fires when checkbox value changes
	 *
	 * @returns {void}
	 */
	const onChange = useCallback( () => {
		onSelectKeyphrases( prev => isSelected ? prev.filter( e => e !== keyphrase ) : prev.concat( keyphrase ) );
	}, [ onSelectKeyphrases, isSelected, keyphrase ] );

	return <WincherTableRowElement isEnabled={ isEnabled }>
		<SelectKeyphraseCheckboxWrapper>
			{ hasHistory && <Checkbox
				id={ "select-" + keyphrase }
				onChange={ onChange }
				checked={ isSelected }
				label=""
			/> }
		</SelectKeyphraseCheckboxWrapper>

		<KeyphraseTdWrapper>
			{ keyphrase }{ isFocusKeyphrase && <span>*</span> }
		</KeyphraseTdWrapper>

		{ getPositionalDataByState( props ) }

		<TrackingTdWrapper>
			{ renderToggleState( { keyphrase, isEnabled, toggleAction, isLoading } ) }
		</TrackingTdWrapper>
	</WincherTableRowElement>;
}

WincherTableRow.propTypes = {
	rowData: PropTypes.object,
	keyphrase: PropTypes.string.isRequired,
	onTrackKeyphrase: PropTypes.func,
	onUntrackKeyphrase: PropTypes.func,
	isFocusKeyphrase: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	// eslint-disable-next-line react/no-unused-prop-types
	websiteId: PropTypes.string,
	isSelected: PropTypes.bool.isRequired,
	onSelectKeyphrases: PropTypes.func.isRequired,
};

WincherTableRow.defaultProps = {
	rowData: {},
	onTrackKeyphrase: () => {},
	onUntrackKeyphrase: () => {},
	isFocusKeyphrase: false,
	isDisabled: false,
	isLoading: false,
	websiteId: "",
};
