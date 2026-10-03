import CollapsibleCornerstone from "../components/CollapsibleCornerstone";
import TopicInputsContainer from "../components/contentAnalysis/TopicInputs";
import ReadabilityAnalysis from "../components/contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "../components/contentAnalysis/SeoAnalysis";
import InclusiveLanguageAnalysis from "../components/contentAnalysis/InclusiveLanguageAnalysis";
import { ContentBlocks } from "../components/contentBlocks/ContentBlocks";

window.yoast = window.yoast || {};
window.yoast.externals = window.yoast.externals || {};
window.yoast.externals.components = {
	CollapsibleCornerstone,
	TopicInputs: TopicInputsContainer,
	// Backwards-compatible alias for external consumers (e.g. Premium) that still import `KeywordInput`.
	KeywordInput: TopicInputsContainer,
	ReadabilityAnalysis,
	SeoAnalysis,
	InclusiveLanguageAnalysis,
	ContentBlocks,
};
