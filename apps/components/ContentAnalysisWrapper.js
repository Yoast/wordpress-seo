import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import ContentAnalysis from "yoast-components/composites/Plugin/ContentAnalysis/components/ContentAnalysis";
import LanguageNoticeWrapper from "./LanguageNoticeWrapper.js";

/**
 * Returns the ContentAnalysisWrapper component.
 *
 * @returns {ReactElement} The ContentAnalysisWrapper component.
 */
export default function ContentAnalysisWrapper() {
	const problemsResults = [
		{
			text: "Your text is bad, and you should feel bad.",
			id: "1",
			rating: "bad",
			hasMarks: true,
			marker: { data: "marker" },
		},
	];

	const goodResults = [
		{
			text: "You're doing <strong>great!</strong>",
			id: "2",
			rating: "good",
			hasMarks: false,
		},
		{
			text: "Woohoo!",
			id: "3",
			rating: "good",
			hasMarks: true,
			marker: { data: "marker" },
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
			text: "<span style=\"color: red;\">Error: Analysis not loaded</span>",
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

	return (
		<ExamplesContainer>
			<LanguageNoticeWrapper
				changeLanguageLink="#"
				language="English"
				showLanguageNotice={ true }
				canChangeLanguage={ true }
			/>
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
				onMarkButtonClick={ ( id, marker ) => {
					// eslint-disable-next-line no-console
					console.log( "Marker button clicked", id, marker );
				} }
				marksButtonStatus={ "enabled" }
			/>
		</ExamplesContainer>
	);
}
