import React from "react";
import renderer from "react-test-renderer";

import SEOScoreAssessment from "../components/SEOScoreAssessment";

test( "the SEOScoreAssessment matches the snapshot", () => {
	const component = renderer.create(
		<SEOScoreAssessment color="black" html="<strong>HTML!</strong>" score="25" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SEOScoreAssessment without score matches the snapshot", () => {
	const component = renderer.create(
		<SEOScoreAssessment color="black" html="<strong>HTML!</strong>" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
