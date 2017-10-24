import React from "react";
import styled from "styled-components";

import ContentAnalysis from "../composites/Plugin/ContentAnalysis/components/ContentAnalysis";

/**
 * Returns the HelpCenterWrapper component.
 *
 * @returns {ReactElement} The HelpCenterWrapper component.
 */
export default function HelpCenterWrapper() {
	const problemsResults = {
		results: [
			{
				text: "Short text.",
				id: "1",
				rating: "bad",
				hasMarks: false,
			},
			{
				text: "Longer text. No meta description has been specified. Search engines will display copy from the page instead. " +
				"No meta description has been specified. Search engines will display copy from the page instead.",
				id: "2",
				rating: "bad",
				hasMarks: true,
			},
			{
				text: "No meta description has been specified. Search engines will display copy from the page instead.",
				id: "3",
				rating: "bad",
				hasMarks: true,
			},
		],
		heading: "Problems",
		initialIsOpen: true,
	};

	const goodResults = {
		results: [
			{
				text: "Short text.",
				id: "17",
				rating: "good",
				hasMarks: false,
			},
			{
				text: "Longer text. No meta description has been specified. Search engines will display copy from the page instead. " +
				"No meta description has been specified. Search engines will display copy from the page instead.",
				id: "18",
				rating: "good",
				hasMarks: true,
			},
			{
				text: "No meta description has been specified. Search engines will display copy from the page instead.",
				id: "29",
				rating: "good",
				hasMarks: true,
			},
			{
				text: "Not applicable result.",
				id: "20",
				rating: "good",
				hasMarks: false,
			},
			{
				text: "Not applicable result.",
				id: "4",
				rating: "good",
				hasMarks: false,
			},
		],
		heading: "Good",
		initialIsOpen: false,
	};

	const improvementsResults = {
		results: [
			{
				text: "Short text.",
				id: "5",
				rating: "OK",
				hasMarks: false,
			},
			{
				text: "Longer text. No meta description has been specified. Search engines will display copy from the page instead. " +
				"No meta description has been specified. Search engines will display copy from the page instead.",
				id: "6",
				rating: "OK",
				hasMarks: true,
			},
		],
		heading: "Improvements",
		initialIsOpen: false,
	};

	const errorsResults = {
		results: [
			{
				text: "Short text.",
				id: "9",
				rating: "feedback",
				hasMarks: false,
			},
			{
				text: "Longer text. No meta description has been specified. Search engines will display copy from the page instead. " +
				"No meta description has been specified. Search engines will display copy from the page instead.",
				id: "10",
				rating: "feedback",
				hasMarks: true,
			},
			{
				text: "No meta description has been specified. Search engines will display copy from the page instead.",
				id: "11",
				rating: "feedback",
				hasMarks: true,
			},
			{
				text: "Not applicable result.",
				id: "12",
				rating: "feedback",
				hasMarks: false,
			},
		],
		heading: "Errors",
		initialIsOpen: false,
	};

	const considerationsResults = {
		results: [
			{
				text: "Short text.",
				id: "13",
				rating: "feedback",
				hasMarks: false,
			},
			{
				text: "Longer text. No meta description has been specified. Search engines will display copy from the page instead. " +
				"No meta description has been specified. Search engines will display copy from the page instead.",
				id: "14",
				rating: "feedback",
				hasMarks: true,
			},
			{
				text: "No meta description has been specified. Search engines will display copy from the page instead.",
				id: "15",
				rating: "feedback",
				hasMarks: true,
			},
			{
				text: "Not applicable result.",
				id: "16",
				rating: "feedback",
				hasMarks: false,
			},
			{
				text: "Short text.",
				id: "21",
				rating: "feedback",
				hasMarks: false,
			},
			{
				text: "Longer text. No meta description has been specified. Search engines will display copy from the page instead. " +
				"No meta description has been specified. Search engines will display copy from the page instead.",
				id: "22",
				rating: "feedback",
				hasMarks: true,
			},
			{
				text: "No meta description has been specified. Search engines will display copy from the page instead.",
				id: "23",
				rating: "feedback",
				hasMarks: true,
			},
			{
				text: "Not applicable result.",
				id: "24",
				rating: "feedback",
				hasMarks: false,
			},
		],
		heading: "Considerations",
		initialIsOpen: false,
	};

	const leeg = [];

	return (
		<ContentAnalysis
			problemsResults={ problemsResults }
			improvementsResults={ improvementsResults }
			goodResults={ goodResults }
			considerationsResults={ considerationsResults }
			errorsResults={ errorsResults }/>
	);
}
