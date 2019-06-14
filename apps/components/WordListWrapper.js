import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import { WordList } from "@yoast/components";

const relevantWords = [ 'word1', 'word2', 'word3' ];

const WordListWrapper = () => {
	return (
		<ExamplesContainer>
			<WordList
				title="WordList example"
				words={ relevantWords }
				showBeforeList={ <p>This is an example text that will be displayed before the list is rendered.</p> }
				showAfterList={ <p>This is and example text that will be displayed after the list is rendered.</p> }
			/>
		</ExamplesContainer>
	);
};

export default WordListWrapper;
