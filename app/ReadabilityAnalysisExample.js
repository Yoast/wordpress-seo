import React from "react";
import styled from "styled-components";

import ReadabilityAnalysis from "../composites/Plugin/ContentAnalysis/components/ReadabilityAnalysis";

const Container = styled.div`
    min-width: 255px;
    width: 280px;
    min-height: 100vh;
	background-color: white;
	margin: 0 auto;
	padding: 12px;
	font-size: 13px;
	font-family: -apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Oxygen-Sans,Ubuntu,Cantarell,“Helvetica Neue”,sans-serif;
`;

/**
 * Returns the ReadabilityAnalysisExample component.
 *
 * @returns {ReactElement} The ReadabilityAnalysisExample component.
 */
export default function ReadabilityAnalysisExample() {
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
		<Container>
			<ReadabilityAnalysis
				helpText={ {
					text: [
						"This analysis checks your writing for grammar and writing style so your content is as clear as it can be, ",
						<a key="1" href="https://yoa.st/content-analysis" target="_blank" rel="noopener noreferrer">
							Learn more about Readability Analysis
						</a>,
						".",
					],
				} }
				languageNotice={ {
					canChangeLanguage: true,
					changeLanguageLink: "#",
					language: "English",
					showLanguageNotice: true,
				} }
				contentAnalysis={ {
					problemsResults,
					improvementsResults,
					goodResults,
					considerationsResults,
					errorsResults,
					onMarkButtonClick: ( id, marker ) => {
						console.log( "Marker button clicked", id, marker );
					},
					marksButtonStatus: "enabled",
				} }
			/>
		</Container>
	);
}
