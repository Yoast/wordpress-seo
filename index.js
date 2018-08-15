/*
 * Composites imports.
 */
// Composites/OnboardingWizard imports.
import { default as OnboardingWizard } from "./composites/OnboardingWizard/OnboardingWizard";
import { default as MessageBox } from "./composites/OnboardingWizard/MessageBox";
import { default as LoadingIndicator } from "./composites/OnboardingWizard/LoadingIndicator";
import { default as sendRequest } from "./composites/OnboardingWizard/helpers/ajaxHelper";
// Composites/AngoliaSearch imports.
import { default as AlgoliaSearcher } from "./composites/AlgoliaSearch/AlgoliaSearcher";
// Composites/Plugin imports.
import { default as ScoreAssessments } from "./composites/Plugin/Shared/components/ScoreAssessments";
import { default as Collapsible } from "./composites/Plugin/Shared/components/Collapsible";
import { default as LanguageNotice } from "./composites/Plugin/Shared/components/LanguageNotice";
import { default as YoastButton } from "./composites/Plugin/Shared/components/YoastButton";
import { default as YoastModal } from "./composites/Plugin/Shared/components/YoastModal";
import { default as SvgIcon } from "./composites/Plugin/Shared/components/SvgIcon";
import { default as ContentAnalysis } from "./composites/Plugin/ContentAnalysis/components/ContentAnalysis";
import { default as HelpCenter } from "./composites/Plugin/HelpCenter/HelpCenter.js";
import CornerstoneToggle from "./composites/Plugin/CornerstoneContent/components/CornerstoneToggle";

// Composites/LinkSuggestions imports.
import { default as LinkSuggestions } from "./composites/LinkSuggestions/LinkSuggestions";
// Composites/KeywordSuggestions imports.
import { default as KeywordSuggestions } from "./composites/KeywordSuggestions/KeywordSuggestions";
// Composites/basic imports.
import { default as Loader } from "./composites/basic/Loader";

export {
	OnboardingWizard,
	AlgoliaSearcher,
	HelpCenter,
	MessageBox,
	LinkSuggestions,
	KeywordSuggestions,
	LanguageNotice,
	ContentAnalysis,
	Collapsible,
	LoadingIndicator,
	ScoreAssessments,
	YoastButton,
	YoastModal,
	SvgIcon,
	Loader,
	CornerstoneToggle,
	sendRequest,
};

export { default as HelpText } from "./composites/Plugin/Shared/components/HelpText";
export { default as SynonymsInput } from "./composites/Plugin/Shared/components/SynonymsInput";
export * from "./composites/Plugin/SnippetPreview";
export * from "./composites/Plugin/SnippetEditor";
export * from "./forms";
export { default as colors } from "./style-guide/colors.json";
export { default as utils } from "./utils";
export { getRtlStyle } from "./utils/helpers/styled-components";
export { localize } from "./utils/i18n";
export { setTranslations } from "./utils/i18n";
export { translate } from "./utils/i18n";
export * from "./composites/Plugin/DashboardWidget";
export { replacementVariablesShape, recommendedReplacementVariablesShape } from "./composites/Plugin/SnippetEditor/constants";
export { default as analysis } from "./composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
export { default as decodeHTML } from "./composites/OnboardingWizard/helpers/htmlDecoder";
export { default as WordpressFeed } from "./composites/Plugin/DashboardWidget/components/WordpressFeed";
export { default as SeoAssessment } from "./composites/Plugin/DashboardWidget/components/SeoAssessment";
export { default as VideoTutorial } from "./composites/HelpCenter/views/VideoTutorial";
export { default as KeywordInput } from "./composites/Plugin/Shared/components/KeywordInput";
export { default as Icon } from "./composites/Plugin/Shared/components/Icon";
export { default as YoastSeoIcon } from "./composites/basic/YoastSeoIcon";
export { insightsReducer } from "./redux/reducers/insights";
export { setProminentWords } from "./redux/actions/insights";
export { setReadabilityResults,
	setSeoResultsForKeyword,
	setOverallReadabilityScore,
	setOverallSeoScore } from "./composites/Plugin/ContentAnalysis/actions/contentAnalysis";
