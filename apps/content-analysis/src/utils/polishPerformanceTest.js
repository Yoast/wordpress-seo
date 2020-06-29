import contentConfiguration from "yoastsrc/config/content/combinedConfig";
import getLanguage from "yoastsrc/helpers/getLanguage";
import getMorphologyData from "./getMorphologyData";
import Researcher from "yoastsrc/researcher";

// Import keyphrase-related assessments
import IntroductionKeywordAssessment from "yoastsrc/assessments/seo/IntroductionKeywordAssessment";
import KeywordDensityAssessment from  "yoastsrc/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "yoastsrc/assessments/seo/MetaDescriptionKeywordAssessment";
import SubheadingsKeywordAssessment from "yoastsrc/assessments/seo/SubHeadingsKeywordAssessment";
import TextImagesAssessment from "yoastsrc/assessments/seo/TextImagesAssessment";
import TitleKeywordAssessment from "yoastsrc/assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "yoastsrc/assessments/seo/UrlKeywordAssessment";
import KeyphraseDistributionAssessment from "yoastsrc/assessments/seo/KeyphraseDistributionAssessment";

// Import researches
import findKeywordInFirstParagraph from "../../../../packages/yoastseo/src/researches/findKeywordInFirstParagraph.js";
import keywordCount from "yoastsrc/researches/keywordCount";
import getKeywordDensity from "../../../../packages/yoastseo/src/researches/getKeywordDensity.js";
import metaDescriptionKeyword from "../../../../packages/yoastseo/src/researches/metaDescriptionKeyword.js";
import matchKeywordInSubheadings from "../../../../packages/yoastseo/src/researches/matchKeywordInSubheadings.js";
import imageCount from "../../../../packages/yoastseo/src/researches/imageCountInText.js";
import altTagCount from "../../../../packages/yoastseo/src/researches/imageAltTags.js";
import findKeywordInPageTitle from "../../../../packages/yoastseo/src/researches/findKeywordInPageTitle.js";
import keywordCountInUrl from "yoastsrc/researches/keywordCountInUrl";
import { keyphraseDistributionResearcher } from "yoastsrc/researches/keyphraseDistribution";
import keyphraseLength from "yoastseo/src/researches/keyphraseLength";
const keyphraseDistribution = keyphraseDistributionResearcher;

/**
 * Runs analysis on full-text test papers.
 *
 * @returns {void}
 */
export function runKeyphraseAnalysis( testPapers, morphologyData ) {
	for ( let i = 0; i < 10; i++ ) {
		testPapers.forEach( ( { testPaper } ) => {
			const paper = testPaper.paper;

			const researcher = new Researcher( paper );
			researcher.addResearchData( morphologyData );

			findKeywordInFirstParagraph( paper, researcher );
			getKeywordDensity( paper, researcher );
			keywordCount( paper, researcher );
			metaDescriptionKeyword( paper, researcher );
			matchKeywordInSubheadings( paper, researcher );
			imageCount
			altTagCount
			findKeywordInPageTitle
			keywordCountInUrl
			keyphraseDistributionResearcher
			keyphraseLength
			keyphraseDistribution

		} );
	}
}
