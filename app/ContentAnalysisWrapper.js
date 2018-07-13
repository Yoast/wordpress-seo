import React from "react";

import ContentAnalysis from "../composites/Plugin/ContentAnalysis/components/ContentAnalysis";
import LanguageNotice from "../composites/Plugin/Shared/components/LanguageNotice.js";

/**
 * Returns the HelpCenterWrapper component.
 *
 * @returns {ReactElement} The HelpCenterWrapper component.
 */
export default function HelpCenterWrapper() {
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
		<div>
			<LanguageNotice
				canChangeLanguage={ true }
				changeLanguageLink={ "#" }
				language={ "English" }
				showLanguageNotice={ true }
			/>
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
				changeLanguageLink="#"
				language="English"
				showLanguageNotice={ true }
				canChangeLanguage={ true }
				onMarkButtonClick={ ( id, marker ) => {
					console.log( "Marker button clicked", id, marker );
				} }
				marksButtonStatus={ "enabled" }
			/>
		</div>
	);
}
