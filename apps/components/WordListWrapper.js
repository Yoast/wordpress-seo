import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import { WordList } from "@yoast/components";

const words = [ "word1", "word2", "word3" ];

/**
 * Creates a word list wrapper.
 *
 * @returns {ExamplesContainer} A word list, wrapped in a container.
 *
 * @constructor
 */
const WordListWrapper = () => {
	return (
		<ExamplesContainer>
			<WordList
				title="WordList example"
				words={ words }
				header={ <p>This is an example text that will be displayed before the list is rendered.</p> }
				footer={ <p>This is and example text that will be displayed after the list is rendered.</p> }
			/>
		</ExamplesContainer>
	);
};

export default WordListWrapper;
