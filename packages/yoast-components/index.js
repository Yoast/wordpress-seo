/*
 * Composites imports.
 */
// Composites/ConfigurationWizard imports.
import { default as OnboardingWizard, MessageBox, LoadingIndicator } from "@yoast/configuration-wizard";
import { sendRequest, decodeHTML } from "@yoast/helpers";

// Import colors from the style guide.
import { colors } from "@yoast/style-guide";

// Composites/AngoliaSearch imports.
import AlgoliaSearcher from "@yoast/algolia-search";
// Composites/Plugin imports.
import { default as Collapsible } from "./composites/Plugin/Shared/components/Collapsible";
import { default as ButtonSection } from "./composites/Plugin/Shared/components/ButtonSection";
import { default as ContentAnalysis } from "./composites/Plugin/ContentAnalysis/components/ContentAnalysis";
import { default as HelpCenter } from "./composites/Plugin/HelpCenter/HelpCenter.js";
import CornerstoneToggle from "./composites/Plugin/CornerstoneContent/components/CornerstoneToggle";

// Composites/LinkSuggestions imports.
import { default as LinkSuggestions } from "./composites/LinkSuggestions/LinkSuggestions";
// Composites/KeywordSuggestions imports.
import { default as KeywordSuggestions } from "./composites/KeywordSuggestions/KeywordSuggestions";

import { getDirectionalStyle } from "@yoast/helpers";

const getRtlStyle = getDirectionalStyle;

// Composites/CoursesOverview imports
import { default as Card, FullHeightCard } from "./composites/CoursesOverview/Card";
import { default as CardBanner } from "./composites/CoursesOverview/CardBanner";
import { default as CardDetails } from "./composites/CoursesOverview/CardDetails";

export {
	OnboardingWizard,
	HelpCenter,
	MessageBox,
	LinkSuggestions,
	KeywordSuggestions,
	ContentAnalysis,
	Collapsible,
	ButtonSection,
	LoadingIndicator,
	CornerstoneToggle,
	sendRequest,
	decodeHTML,
	Card,
	FullHeightCard,
	CardBanner,
	CardDetails,
	getRtlStyle,
	AlgoliaSearcher,
	colors,
};


export * from "./composites/Plugin/ContentAnalysis";
export * from "@yoast/search-metadata-previews";
export { default as utils } from "./utils";
export { localize } from "./utils/i18n";
export { setTranslations } from "./utils/i18n";
export { translate } from "./utils/i18n";
export * from "./composites/Plugin/DashboardWidget";
export { replacementVariablesShape, recommendedReplacementVariablesShape } from "@yoast/search-metadata-previews/SnippetEditor/constants";
export { default as analysis } from "./composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
export { default as WordpressFeed } from "./composites/Plugin/DashboardWidget/components/WordpressFeed";
export { default as SeoAssessment } from "./composites/Plugin/DashboardWidget/components/SeoAssessment";
export { default as VideoTutorial } from "./composites/HelpCenter/views/VideoTutorial";
export { default as KeywordInput } from "./composites/Plugin/Shared/components/KeywordInput";
export { insightsReducer } from "./redux/reducers/insights";
export { setProminentWords } from "./redux/actions/insights";
export { setReadabilityResults,
	setSeoResultsForKeyword,
	setOverallReadabilityScore,
	setOverallSeoScore } from "./composites/Plugin/ContentAnalysis/actions/contentAnalysis";

export {
	HelpText,
	Icon,
	LanguageNotice,
	Loader,
	ScoreAssessments,
	SvgIcon,
	SynonymsInput,
	UpsellButton,
	UpsellLinkButton,
	YoastButton,
	YoastModal,
	YoastSeoIcon,
	YoastWarning,
} from "@yoast/components";

