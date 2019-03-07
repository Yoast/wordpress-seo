// External dependencies.
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AnalysisList } from "yoast-components";

// Internal dependencies.
import { setActiveMarker } from "../redux/actions/results";
import { H3 } from "./headings";
import ScoreIcon from "./ScoreIcon";
import { HorizontalContainer } from "./Container";


// Note the `score / 10` is taken from `Yoast SEO`.
function Results( { seo, readability, activeMarker, onMark } ) {
	return <Fragment>
		<HorizontalContainer marginTop="0">
			<ScoreIcon score={ readability.score / 10 } />
			<H3>Readability</H3>
		</HorizontalContainer>
		<AnalysisList
			results={ readability.results }
			marksButtonActivatedResult={ activeMarker }
			marksButtonClassName="yoast-text-mark"
			onMarksButtonClick={ onMark }
		/>

		<HorizontalContainer>
			<ScoreIcon score={ seo.score / 10 } />
			<H3>SEO</H3>
		</HorizontalContainer>
		<AnalysisList
			results={ seo.results }
			marksButtonActivatedResult={ activeMarker }
			marksButtonClassName="yoast-text-mark"
			onMarksButtonClick={ onMark }
		/>
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			seo: state.results.seo[ "" ],
			readability: state.results.readability,
			activeMarker: state.results.activeMarker || "",
		};
	},
	( dispatch ) => {
		return {
			onMark: ( marker ) => dispatch( setActiveMarker( marker ) ),
		};
	},
)( Results );
