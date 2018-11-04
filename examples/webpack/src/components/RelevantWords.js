// External dependencies.
import { isEqual } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";

// Internal dependencies.
import calculateRelevantWords from "../utils/calculateRelevantWords";

// Caching object.
let previous = {
	text: "",
	locale: "en_US",
	relevantWords: [],
};

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

function RelevantWords( { text, locale } ) {
	// Cache the relevant words 'to' the text & locale.
	let relevantWords;
	if ( isEqual( text, previous.text ) && isEqual( locale, previous.locale ) ) {
		relevantWords = previous.relevantWords;
	} else {
		relevantWords = calculateRelevantWords( text, locale );
		previous = { text, locale, relevantWords };
	}

	return <ReactTable
		data={ relevantWords }
		columns={ columns }
		showPagination={ false }
		defaultPageSize={ relevantWords.length }
	/>;
}

export default connect( ( state ) => {
	return {
		text: state.paper.text,
		locale: state.paper.locale,
	};
} )( RelevantWords );
