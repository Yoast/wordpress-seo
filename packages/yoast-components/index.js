/*
 * Composites imports.
 */
// Composites/ConfigurationWizard imports.
import { default as OnboardingWizard, LoadingIndicator, MessageBox } from "@yoast/configuration-wizard";
import { decodeHTML, getDirectionalStyle, sendRequest } from "@yoast/helpers";
// Import colors from the style guide.
import { colors } from "@yoast/style-guide";
// Composites/AngoliaSearch imports.
import AlgoliaSearcher from "@yoast/algolia-search-box";
// Composites/Plugin imports.
import { default as Collapsible } from "./composites/Plugin/Shared/components/Collapsible";
import { default as ButtonSection } from "./composites/Plugin/Shared/components/ButtonSection";
import { default as ContentAnalysis } from "./composites/Plugin/ContentAnalysis/components/ContentAnalysis";
import { default as HelpCenter } from "./composites/Plugin/HelpCenter/HelpCenter.js";
import CornerstoneToggle from "./composites/Plugin/CornerstoneContent/components/CornerstoneToggle";
// Composites/LinkSuggestions imports.
import { default as LinkSuggestions } from "./composites/LinkSuggestions/LinkSuggestions";

const getRtlStyle = getDirectionalStyle;


export {
	OnboardingWizard,
	HelpCenter,
	MessageBox,
	LinkSuggestions,
	ContentAnalysis,
	Collapsible,
	ButtonSection,
	LoadingIndicator,
	CornerstoneToggle,
	sendRequest,
	decodeHTML,
	getRtlStyle,
	AlgoliaSearcher,
	colors,
};

export * from "./composites/Plugin/DashboardWidget";
export * from "./composites/Plugin/ContentAnalysis";
export * from "@yoast/search-metadata-previews";
export { default as utils } from "./utils";
export { localize } from "./utils/i18n";
export { setTranslations } from "./utils/i18n";
export { translate } from "./utils/i18n";
export { default as analysis } from "./composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
export { ArticleList as WordpressFeed } from "@yoast/components";
export { SiteSEOReport as SeoAssessment } from "@yoast/analysis-report";
export { default as VideoTutorial } from "./composites/HelpCenter/views/VideoTutorial";
export { default as KeywordInput } from "./composites/Plugin/Shared/components/KeywordInput";
export { insightsReducer } from "./redux/reducers/insights";
export { setProminentWords } from "./redux/actions/insights";
export {
	setReadabilityResults,
	setSeoResultsForKeyword,
	setOverallReadabilityScore,
	setOverallSeoScore,
} from "./composites/Plugin/ContentAnalysis/actions/contentAnalysis";

export {
	Card,
	FullHeightCard,
	CardBanner,
	CourseDetails as CardDetails,
	HelpText,
	Icon,
	KeywordSuggestions,
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
	StyledSection,
	StyledHeading,
	StyledSectionBase,
} from "@yoast/components";

