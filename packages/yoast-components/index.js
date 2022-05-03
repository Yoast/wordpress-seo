/*
 * Composites imports.
 */
// Composites/ConfigurationWizard imports.
import { decodeHTML, getDirectionalStyle, sendRequest } from "@yoast/helpers";
// Import colors from the style guide.
import { colors } from "@yoast/style-guide";
// Composites/Plugin imports.
import { Collapsible } from "@yoast/components";
import { default as ButtonSection } from "./composites/Plugin/Shared/components/ButtonSection";
import { default as ContentAnalysis } from "./composites/Plugin/ContentAnalysis/components/ContentAnalysis";
import CornerstoneToggle from "./composites/Plugin/CornerstoneContent/components/CornerstoneToggle";
// Composites/LinkSuggestions imports.
import { default as LinkSuggestions } from "./composites/LinkSuggestions/LinkSuggestions";

const getRtlStyle = getDirectionalStyle;

/**
 * @deprecated since 5.13.1. Use the `OnboardingWizard` from the `@yoast/configuration-wizard` package instead.
 *
 * @returns {null} returns nothing.
 */
const OnboardingWizard = () => {
	console.warn( "Deprecation Warning: Deprecated since 5.13.1. " +
		"Use the `OnboardingWizard` from the `@yoast/configuration-wizard` package instead." );
	return null;
};

/**
 * @deprecated since 5.13.1. Use the `MessageBox` from the `@yoast/configuration-wizard` package instead.
 *
 * @returns {null} returns nothing.
 */
const MessageBox = () => {
	console.warn( "Deprecation Warning: Deprecated since 5.13.1. " +
		"Use the `MessageBox` from the `@yoast/configuration-wizard` package instead." );
	return null;
};

/**
 * @deprecated since 5.13.1. Use the `LoadingIndicator` from the `@yoast/configuration-wizard` package instead.
 *
 * @returns {null} returns nothing.
 */
const LoadingIndicator = () => {
	console.warn( "Deprecation Warning: Deprecated since 5.13.1. " +
		"Use the `LoadingIndicator` from the `@yoast/configuration-wizard` package instead." );
	return null;
};

export {
	OnboardingWizard,
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
	colors,
};

export * from "./composites/Plugin/DashboardWidget";
export * from "./composites/Plugin/ContentAnalysis";

export
{
	FixedWidthContainer,
	HelpTextWrapper,
	SnippetPreview,
	SettingsSnippetEditor,
	SnippetEditor,
	lengthProgressShape,
} from "@yoast/search-metadata-previews";
export {
	ReplacementVariableEditor,
	recommendedReplacementVariablesShape,
	replacementVariablesShape,
} from "@yoast/replacement-variable-editor";

export { default as utils } from "./utils";
export { localize } from "./utils/i18n";
export { setTranslations } from "./utils/i18n";
export { translate } from "./utils/i18n";
export { default as analysis } from "./composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
export { ArticleList as WordpressFeed } from "@yoast/components";
export { SiteSEOReport as SeoAssessment } from "@yoast/analysis-report";
export { default as KeywordInput } from "./composites/Plugin/Shared/components/KeywordInput";
export { insightsReducer } from "./redux/reducers/insights";
export { setWordsForInsights } from "./redux/actions/insights";
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
	WordOccurrenceInsights,
	LanguageNotice,
	Loader,
	ScoreAssessments,
	SvgIcon,
	SynonymsInput,
	UpsellButton,
	UpsellLinkButton,
	YoastButton,
	Modal as YoastModal,
	YoastSeoIcon,
	Warning as YoastWarning,
	StyledSection,
	StyledHeading,
	StyledSectionBase,
} from "@yoast/components";
