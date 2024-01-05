export { default as AbstractResearcher } from "./AbstractResearcher";
import * as values from "./values";
import * as researches from "./researches";
import * as processingHelpers from "./helpers";
import wordComplexityHelperEnglish from "./languages/en/helpers/checkIfWordIsComplex";
import wordComplexityHelperGerman from "./languages/de/helpers/checkIfWordIsComplex";
import wordComplexityHelperSpanish from "./languages/es/helpers/checkIfWordIsComplex";
import wordComplexityHelperFrench from "./languages/fr/helpers/checkIfWordIsComplex";
import wordComplexityConfigEnglish from "./languages/en/config/wordComplexity";
import wordComplexityConfigGerman from "./languages/de/config/wordComplexity";
import wordComplexityConfigSpanish from "./languages/es/config/wordComplexity";
import wordComplexityConfigFrench from "./languages/fr/config/wordComplexity";

const languageHelpers = {
	wordComplexityHelperEnglish,
	wordComplexityHelperGerman,
	wordComplexityHelperSpanish,
	wordComplexityHelperFrench,
};
const languageConfigs = {
	wordComplexityConfigEnglish,
	wordComplexityConfigGerman,
	wordComplexityConfigSpanish,
	wordComplexityConfigFrench,
};

export { languageConfigs, languageHelpers, values, researches, processingHelpers };
