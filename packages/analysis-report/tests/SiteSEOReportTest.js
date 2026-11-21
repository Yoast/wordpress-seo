import React from "react";
import { render } from "@testing-library/react";

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

	it( "The SiteSEOReport should match the snapshot", function() {
		const { container } = render(
			<SiteSEOReport
				className="test_SiteSEOReport"
				seoAssessmentText="Test assessment"
				seoAssessmentItems={ siteSEOReportItems }
				barHeight={ "10" }
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
