import React from "react";
import { createComponentWithIntl } from "../../../../utils/intlProvider";
import ContentAnalysis from "../components/ContentAnalysis.js";

test( "the AnalysisResult component matches the snapshot", () => {
	const problemsResults = [
		{
			text: "Your text is bad, and you should feel bad.",
			id: "1",
			rating: "bad",
			hasMarks: true,
		},
	];

	const goodResults = [
		{
			text: "You're doing great!",
			id: "2",
			rating: "good",
			hasMarks: false,
		},
		{
			text: "Woohoo!",
			id: "3",
			rating: "good",
			hasMarks: true,
		},
	];

	const improvementsResults = [
		{
			text: "I know you can do better! You can do it!",
			id: "4",
			rating: "OK",
			hasMarks: false,
		},
	];

	const errorsResults = [
		{
			text: "Error: Analysis not loaded",
			id: "5",
			rating: "feedback",
			hasMarks: false,
		},
	];

	const considerationsResults = [
		{
			text: "Maybe you should change this...",
			id: "6",
			rating: "feedback",
			hasMarks: false,
		},
	];

	const component = createComponentWithIntl(
		<ContentAnalysis
			problemsResults={ problemsResults }
			improvementsResults={ improvementsResults }
			goodResults={ goodResults }
			considerationsResults={ considerationsResults }
			errorsResults={ errorsResults }
			changeLanguageLink={ "#" }
			language="English"
		/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
