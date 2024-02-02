import CollapsibleCornerstone from "../components/CollapsibleCornerstone";
import KeywordInputContainer from "../components/contentAnalysis/KeywordInput";
import ReadabilityAnalysis from "../components/contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../components/contentAnalysis/SeoAnalysis";
import InclusiveLanguageAnalysis from "../components/contentAnalysis/InclusiveLanguageAnalysis";

window.yoast = window.yoast || {};
window.yoast.externals = window.yoast.externals || {};
window.yoast.externals.components = {
	CollapsibleCornerstone,
	KeywordInput: KeywordInputContainer,
	ReadabilityAnalysis,
	SeoAnalysis,
	InclusiveLanguageAnalysis,
};
