// External dependencies.
import { uniqueId, omit } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { bindActionCreators } from "redux";
import testTexts from "yoastspec/fullTextTests/testTexts";

// Internal dependencies.
import { setPaper } from "../redux/actions/paper";
import { HorizontalContainer } from "./Container";
import { H3 } from "./headings";


const papers = testTexts.map( testText => {
	return {
		label: testText.name,
		value: testText.paper,
	};
} );

const selectTheme = ( theme ) => (
	{
		...theme,
		borderRadius: 0,
	}
);

function SelectTestPaper( {
	id = uniqueId( "select-test-paper-" ),
	label = "Use test paper as input",
	setPaper: dispatchPaper,
} ) {
	return <HorizontalContainer marginTop="0">
		<label htmlFor={ id }>
			<H3>{ label }</H3>
		</label>
		<Select
			id={ id }
			value={ null }
			options={ papers }
			onChange={ ( { value } ) => {
				const paper = value.serialize();
				dispatchPaper( omit( paper, "_parseClass" ) );
			} }
			theme={ selectTheme }
		/>
	</HorizontalContainer>;
}

export default connect(
	() => (
		{}
	),
	( dispatch ) => {
		return bindActionCreators( {
			setPaper,
		}, dispatch );
	},
)( SelectTestPaper );
