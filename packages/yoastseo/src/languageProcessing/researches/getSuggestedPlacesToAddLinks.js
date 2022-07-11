import getSentences from "../helpers/sentence/getSentences";
import addMark from "../../markers/addMark";
import { Mark } from "../../values";
import { getWords } from "../index";
import { orderBy } from "lodash-es";

/**
 *
 * @param {Paper} paper
 * @param {Researcher} researcher
 */
function getSuggestedPlacesToAddLinks( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const prominentWords = researcher.getData( "getSuggestedPlacesToAddLinks" );
	const functionWords = researcher.getConfig( "functionWords" );

	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	let scoredSentences = sentences.map( sentence => {
		const words = getWords( sentence ).map( word => word.toLocaleLowerCase() );
		const contentWords = words.filter( word => ! functionWords.includes( word ) );

		if ( contentWords.length === 0 ) {
			return { sentence, score: 0 };
		}

		const totalFrequency = contentWords.reduce( ( sum, word ) => {
			if ( prominentWords[ word ] ) {
				return sum + prominentWords[ word ].weight;
			}
			return sum;
		}, 0 );

		return { sentence, score: totalFrequency };
	} );

	scoredSentences = orderBy( scoredSentences, [ "score" ], [ "desc" ] );

	const topSentences = scoredSentences.slice( 0, 3 );

	const marks = topSentences.map( scoredSentence => new Mark( {
		original: scoredSentence.sentence,
		marked: addMark( scoredSentence.sentence ),
	} ) );

	return { paper, marks };
}

export default getSuggestedPlacesToAddLinks;
