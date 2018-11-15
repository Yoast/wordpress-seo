// External dependencies.
import { isEqual } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";

// Internal dependencies.
import calculateRelevantWords from "../utils/calculateRelevantWords";


// Cache the relevant words.
let previousRelevantWords = {
	text: "",
	locale: "en_US",
	data: {},
};

// Determine which columns to display.
const columns = [
	{
		Header: "Word",
		accessor: "word",
	}, {
		Header: "Density",
		accessor: "density",
	}, {
		Header: "Occurrences",
		accessor: "occurrences",
	}, {
		Header: "Length",
		accessor: "length",
	}, {
		Header: "Relevant word %",
		accessor: "relevantWordPercentage",
	}, {
		Header: "Length bonus",
		accessor: "lengthBonus",
	}, {
		Header: "Multiplier",
		accessor: "multiplier",
	}, {
		Header: "Relevance",
		accessor: "relevance",
	},
];

/**
 * Displays a table with the relevant words.
 *
 * @param {Object} data The relevant words.
 *
 * @returns {ReactComponent} The relevant words component.
 */
function RelevantWords( { data } ) {
	return <ReactTable
		data={ data }
		columns={ columns }
		defaultPageSize={ 100 }
		minRows={ 0 }
	/>;
}

/**
 * Retrieve the relevant words. Uses cached version when possible.
 *
 * @param {string} text   The text.
 * @param {string} locale The locale.
 *
 * @returns {Object} The relevant words.
 */
function getRelevantWords( text, locale ) {
	if ( ! isEqual( text, previousRelevantWords.text ) || ! isEqual( locale, previousRelevantWords.locale ) ) {
		previousRelevantWords = {
			text,
			locale,
			data: calculateRelevantWords( text, locale ),
		};
	}
	return previousRelevantWords.data;
}

export default connect( ( state ) => {
	return {
		data: getRelevantWords( state.paper.text, state.paper.locale ),
	};
} )( RelevantWords );
