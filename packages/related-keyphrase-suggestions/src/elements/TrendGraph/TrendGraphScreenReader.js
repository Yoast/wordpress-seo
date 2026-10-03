import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

const dataTableHeaderLabels = [
	__( "Twelve months ago", "wordpress-seo" ),
	__( "Eleven months ago", "wordpress-seo" ),
	__( "Ten months ago", "wordpress-seo" ),
	__( "Nine months ago", "wordpress-seo" ),
	__( "Eight months ago", "wordpress-seo" ),
	__( "Seven months ago", "wordpress-seo" ),
	__( "Six months ago", "wordpress-seo" ),
	__( "Five months ago", "wordpress-seo" ),
	__( "Four months ago", "wordpress-seo" ),
	__( "Three months ago", "wordpress-seo" ),
	__( "Two months ago", "wordpress-seo" ),
	__( "Last month", "wordpress-seo" ),
];

/**
 * Adapts the chart y axis data to a more meaningful format for the alternative representation in the data table.
 *
 * @param {number} y The raw y axis data of the chart.
 *
 * @returns {number} The formatted y axis data.
 */
const mapChartDataToTableData = ( y ) => {
	return Math.round( y * 100 );
};

/**
 * Renders a table for an accessible representation of the SVG area chart.
 *
 * @param {array}    data                      Array of objects with X and Y coordinates for the SVG chart points.
 * @param {Function} mapChartDataToTableData   Function to adapt the chart points to meaningful data for the table.
 *
 * @returns {JSX.Element} The data table for the SVG area chart.
 */
export const TrendGraphScreenReader = ( {
	data,
} ) => {
	if ( data.length !== dataTableHeaderLabels.length ) {
		throw new Error( "The number of headers and header labels don't match." );
	}

	return (
		<div
			className="yst-sr-only"
		>
			<table>
				<caption>{ __( "Keyphrase volume in the last 12 months on a scale from 0 to 100.", "wordpress-seo" ) }</caption>
				<thead>
					<tr>
						{
							dataTableHeaderLabels.map( ( label, index ) => {
								return <th key={ index }>{ label }</th>;
							} )
						}
					</tr>
				</thead>
				<tbody>
					<tr>
						{
							data.map( ( point, index ) => {
								return <td key={ index }>{ mapChartDataToTableData( point ) }</td>;
							} )
						}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

TrendGraphScreenReader.propTypes = {
	data: PropTypes.arrayOf( PropTypes.number ).isRequired,
};
