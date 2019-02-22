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
	description: "",
	keyword: "",
	synonyms: "",
	title: "",
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
		minRows={ 3 }
	/>;
}

/**
 * Retrieve the relevant words. Uses cached version when possible.
 *
 * @param {Paper} paper   The paper to get relevant words for.
 *
 * @returns {Object} The relevant words.
 */
function getRelevantWords( paper ) {
	const text = paper.text;
	const locale = paper.locale;
	const description = paper.description;
	const keyword = paper.keyword;
	const synonyms = paper.synonyms;
	const title = paper.title;

	if (
		! isEqual( text, previousRelevantWords.text ) ||
		! isEqual( locale, previousRelevantWords.locale ) ||
		! isEqual( description, previousRelevantWords.description ) ||
		! isEqual( keyword, previousRelevantWords.keyword ) ||
		! isEqual( synonyms, previousRelevantWords.synonyms ) ||
		! isEqual( title, previousRelevantWords.title )
	) {
		previousRelevantWords = {
			text,
			locale,
			description,
			keyword,
			synonyms,
			title,
			data: calculateRelevantWords( paper ),
		};
	}
	return previousRelevantWords.data;
}

export default connect( ( state ) => {
	return {
		data: getRelevantWords( state.paper ),
	};
} )( RelevantWords );
