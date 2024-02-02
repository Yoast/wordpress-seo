// Readability assessments.
import ParagraphTooLongAssessment from "./readability/ParagraphTooLongAssessment";
import PassiveVoiceAssessment from "./readability/PassiveVoiceAssessment";
import SentenceBeginningsAssessment from "./readability/SentenceBeginningsAssessment";
import SentenceLengthInTextAssessment from "./readability/SentenceLengthInTextAssessment";
import SubheadingDistributionTooLongAssessment from "./readability/SubheadingDistributionTooLongAssessment";
import TextPresenceAssessment from "./readability/TextPresenceAssessment";
import TransitionWordsAssessment from "./readability/TransitionWordsAssessment";

// SEO assessments.
import FunctionWordsInKeyphraseAssessment from "./seo/FunctionWordsInKeyphraseAssessment";
import InternalLinksAssessment from "./seo/InternalLinksAssessment";
import IntroductionKeywordAssessment from "./seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./seo/KeyphraseLengthAssessment";
import KeyphraseDensityAssessment, { KeywordDensityAssessment } from "./seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "./seo/MetaDescriptionLengthAssessment";
import OutboundLinksAssessment from "./seo/OutboundLinksAssessment";
import PageTitleWidthAssessment from "./seo/PageTitleWidthAssessment";
import SingleH1Assessment from "./seo/SingleH1Assessment";
import SubheadingsKeywordAssessment from "./seo/SubHeadingsKeywordAssessment";
import TextCompetingLinksAssessment from "./seo/TextCompetingLinksAssessment";
import TextLengthAssessment from "./seo/TextLengthAssessment";
import KeyphraseInSEOTitleAssessment from "./seo/KeyphraseInSEOTitleAssessment";
import { SlugKeywordAssessment, UrlKeywordAssessment } from "./seo/UrlKeywordAssessment";
import ImageKeyphraseAssessment from "./seo/KeyphraseInImageTextAssessment";
import ImageCountAssessment from "./seo/ImageCountAssessment";

import InclusiveLanguageAssessment from "./inclusiveLanguage/InclusiveLanguageAssessment";

const readability = {
	ParagraphTooLongAssessment,
	PassiveVoiceAssessment,
	SentenceBeginningsAssessment,
	SentenceLengthInTextAssessment,
	SubheadingDistributionTooLongAssessment,
	TextPresenceAssessment,
	TransitionWordsAssessment,
};

// We expose the deprecated assessments for backwards compatibility.
const seo = {
	FunctionWordsInKeyphraseAssessment,
	InternalLinksAssessment,
	IntroductionKeywordAssessment,
	KeyphraseLengthAssessment,
	KeyphraseDensityAssessment,
	KeywordDensityAssessment,
	MetaDescriptionKeywordAssessment,
	MetaDescriptionLengthAssessment,
	OutboundLinksAssessment,
	PageTitleWidthAssessment,
	SingleH1Assessment,
	SubheadingsKeywordAssessment,
	TextCompetingLinksAssessment,
	TextLengthAssessment,
	KeyphraseInSEOTitleAssessment,
	SlugKeywordAssessment,
	UrlKeywordAssessment,
	ImageKeyphraseAssessment,
	ImageCountAssessment,
};

const inclusiveLanguage = {
	InclusiveLanguageAssessment,
};

export {
	readability,
	seo,
	inclusiveLanguage,
};
