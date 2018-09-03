import React, { Fragment } from "react";
import { connect } from "react-redux";

// This is waiting for https://github.com/Yoast/yoast-components/pull/722:
// import { AnalysisList } from "yoast-components";

// The alternative is a lot uglier:
import AnalysisList from "../Results";

import { H3 } from "./headings";
import { setActiveMarker } from "../redux/actions/results";

function Results( { seo, readability, onMark } ) {
	return <Fragment>
		<H3>Readability</H3>
		<AnalysisList results={ seo } onMark={ onMark } />
		<H3>SEO</H3>
		<AnalysisList results={ readability } onMark={ onMark } />
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			seo: state.results.seo,
			readability: state.results.readability,
		};
	},
	( dispatch ) => {
		return {
			onMark: ( marker ) => dispatch( setActiveMarker( marker ) ),
		};
	}
)( Results );
