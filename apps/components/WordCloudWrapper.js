import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import WordCloud from "@yoast/components/src/WordCloud";

const relevantWords = [
	{
		word: "davids",
		stem: "david",
		occurrences: 2,
	},
	{
		word: "goliaths",
		stem: "goliath",
		occurrences: 6,
	},
	{
		word: "word",
		stem: "word",
		occurrences: 4,
	},
];

const WordCloudWrapper = () => {
	return (
		<ExamplesContainer>
			<WordCloud
				words={ relevantWords }
			/>
		</ExamplesContainer>
	);
};

export default WordCloudWrapper;
