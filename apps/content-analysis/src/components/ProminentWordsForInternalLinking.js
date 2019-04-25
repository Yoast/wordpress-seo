// External dependencies.
import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";

// Internal dependencies.
import { prominentWordsForInternalLinking } from "../utils/calculateProminentWords";

// Determine which columns to display.
const columns = [
	{
		Header: "Word",
		accessor: "word",
	}, {
		Header: "Stem",
		accessor: "stem",
	}, {
		Header: "Occurrences",
		accessor: "occurrences",
	},
];

/**
 * Displays a table with the relevant words.
 *
 * @param {Object} data The relevant words.
 *
 * @returns {ReactComponent} The relevant words component.
 */
function ProminentWords( { data } ) {
	return <ReactTable
		data={ data }
		columns={ columns }
		defaultPageSize={ 100 }
		minRows={ 3 }
	/>;
}

export default connect( ( state ) => {
	return {
		data: prominentWordsForInternalLinking( state.paper ),
	};
} )( ProminentWords );
