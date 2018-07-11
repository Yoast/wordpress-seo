import React from "react";
import styled from "styled-components";

import SeoAnalysis from "../composites/Plugin/ContentAnalysis/components/SeoAnalysis";

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
 * Returns the SeoAnalysisExample component.
 *
 * @returns {ReactElement} The SeoAnalysisExample component.
 */
export default function SeoAnalysisExample() {
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

	/**
	 * Handles a piece of changed data.
	 *
	 * @param {string} newKeyword the new keyword.
	 *
	 * @returns {void}
	 */
	const onKeywordChanged = function( newKeyword ) {
		console.log( newKeyword );
	};

	return (
		<Container>
			<SeoAnalysis
				helpText={ {
					text: [
						"A focus keyword is the term (or phrase) you'd like this post to be found with in search engines. ",
						"Enter it below to see how you can improve your text for this term. ",
						<a key="1" href="https://yoa.st/content-analysis" target="_blank" rel="noopener noreferrer">
							Learn more about the Keyword Analysis
						</a>,
						".",
					],
				} }
				keywordInput={ {
					label: "Focus keyword:",
					showLabel: true,
					keyword: "Mountaineering in the catskills during high season.",
					onChange: onKeywordChanged,
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
