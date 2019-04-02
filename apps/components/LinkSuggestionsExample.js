import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import { LinkSuggestions } from "yoast-components";

const suggestions = [
	{
		value: "suggestion 1",
		url: "https://suggestion1.example",
		isActive: true,
		isCornerstone: false,
	},
	{
		value: "suggestion 2",
		url: "https://suggestion2.example",
		isActive: false,
		isCornerstone: true,
	},
];

const LinkSuggestionsExample = () => {
	return (
		<ExamplesContainer>
			<LinkSuggestions
				suggestions={ suggestions }
			/>
		</ExamplesContainer>
	);
};

export default LinkSuggestionsExample;
