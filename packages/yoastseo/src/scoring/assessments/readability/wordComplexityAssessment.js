import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";

import { collectMarkingsInSentence } from "../../../languageProcessing/helpers/word/markWordsInSentences";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";

export default class WordComplexityAssessment extends Assessment {
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				acceptableAmount: 6,
				goodAmount: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/difficult-words" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/difficult-words" ),
		};

		/* Translators: This is the name of the 'Word complexity' SEO assessment.
         * It appears before the feedback in the analysis, for example in the feedback string:
         * "Word complexity: You are not using too many complex words, which makes your text easy to read. Good job!"
         */
		this.name = __( "Word complexity", "wordpress-seo" );
		this.identifier = "wordComplexity";
		this._config = merge( defaultConfig, config );
	}

	getResult( paper, researcher ) {
		this._wordComplexity = researcher.getResearch( "wordComplexity" );


		const calculatedScore = this.calculateResult();
		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.text );
		assessmentResult.setHasMarks( calculatedScore.hasMarks );
		return assessmentResult;
	}

	calculateResult() {
		const complexWordsPercentage = this._wordComplexity.percentage;
		const hasMarks = complexWordsPercentage > 0;
		const assessmentLink = this._config.urlTitle + this.name + "</a>";

		if ( complexWordsPercentage < 5 ) {
			return {
				score: this._config.scores.goodAmount,
				hasMarks: hasMarks,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
					%3$s expands to the anchor end tag */
					__(
						// eslint-disable-next-line max-len
						"%1$s: You are not using too many complex words, which makes your text easy to read. Good job!",
						"wordpress-seo"
					),
					assessmentLink
				),
			};
		}
		return {
			score: this._config.scores.acceptableAmount,
			hasMarks: hasMarks,
			resultText: sprintf(
				/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
				%3$s expands to the anchor end tag */
				__(
					// eslint-disable-next-line max-len
					"%1$s: %2$s of the words in your text is considered complex. %3$sTry to use shorter and more familiar words to improve readability%4$s.",
					"wordpress-seo"
				),
				assessmentLink,
				complexWordsPercentage,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}

	getMarks( paper, researcher ) {
		const wordComplexityResults = researcher.getResearch( "wordComplexity" ).complexWords;
		const matchWordCustomHelper = researcher.getResearch( "matchWordCustomHelper" );
		let markings = [];

		wordComplexityResults.forEach( ( result ) => {
			const complexWords = result.complexWords;
			const sentence = result.sentence;

			if ( complexWords.length > 0 ) {
				markings = markings.concat(
					new Mark( {
						original: sentence,
						marked: collectMarkingsInSentence( sentence, complexWords, matchWordCustomHelper ),
					} )
				);
			}
		} );

		return markings;
	}

	isApplicable( paper, researcher ) {
		return paper.hasText() && researcher.hasResearch( "wordComplexity" );
	}
}
