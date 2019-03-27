import React from "react";
import renderer from "react-test-renderer";

import SiteSEOReport from "../src/SiteSEOReport";

describe( "The SiteSEOReport testing suite", () => {
	const siteSEOReportItems = [
		{
			html: "<div></div>",
			value: 10,
			color: "blue",
		},
		{
			html: "<div></div>",
			value: 15,
			color: "red",
		},
		{
			html: "<div></div>",
			value: 20,
			color: "yellow",
		},
	];

	const component = renderer.create(
		<SiteSEOReport
			className="test_SiteSEOReport"
			seoAssessmentText="Test assessment"
			seoAssessmentItems={ siteSEOReportItems }
			barHeight={ "10" }
		/>
	);

	const tree = component.toJSON();
	it( "The SiteSEOReport should match the snapshot", function() {
		expect( tree ).toMatchSnapshot();
	} );
} );
