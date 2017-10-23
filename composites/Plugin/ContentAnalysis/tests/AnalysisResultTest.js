import React from "react";
import { createComponentWithIntl } from "../../../../utils/intlProvider";
import AnalysisResult from "../components/AnalysisResult.js";

test( "the AnalysisResult component matches the snapshot", () => {
	const component = createComponentWithIntl(
		<AnalysisResult
			ariaLabel="SEOResult"
			bulletColor="blue"
			buttonId="Result button"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClick={ () => {} }
			text={ "You're doing great!" }
			score="good"
		/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
