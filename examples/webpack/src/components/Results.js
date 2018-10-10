import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AnalysisList } from "yoast-components";

import { H3 } from "./headings";
import { setActiveMarker } from "../redux/actions/results";

function Results( { seo, readability, activeMarker, onMark } ) {
	return <Fragment>
		<H3>Readability</H3>
		<AnalysisList
			results={ seo }
			marksButtonActivatedResult={ activeMarker }
			marksButtonClassName="yoast-text-mark"
			onMarksButtonClick={ onMark }
		/>
		<H3>SEO</H3>
		<AnalysisList
			results={ readability }
			marksButtonActivatedResult={ activeMarker }
			marksButtonClassName="yoast-text-mark"
			onMarksButtonClick={ onMark }
		/>
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			seo: state.results.seo[ "" ].results,
			readability: state.results.readability.results,
			activeMarker: state.results.activeMarker || "",
		};
	},
	( dispatch ) => {
		return {
			onMark: ( marker ) => dispatch( setActiveMarker( marker ) ),
		};
	},
)( Results );
