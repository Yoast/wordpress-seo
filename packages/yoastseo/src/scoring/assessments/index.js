// Readability assessments.
import ParagraphTooLongAssessment from "./readability/ParagraphTooLongAssessment";
import PassiveVoiceAssessment from "./readability/PassiveVoiceAssessment";
import SentenceBeginningsAssessment from "./readability/SentenceBeginningsAssessment";
import SentenceLengthInTextAssessment from "./readability/SentenceLengthInTextAssessment";
import SubheadingDistributionTooLongAssessment from "./readability/SubheadingDistributionTooLongAssessment";
import TextPresenceAssessment from "./readability/TextPresenceAssessment";
import TransitionWordsAssessment from "./readability/TransitionWordsAssessment";

// Readability assessments (premium)
import TextAlignmentAssessment from "./readability/TextAlignmentAssessment";
import WordComplexityAssessment from "./readability/WordComplexityAssessment";

// Readability assessments (product)
import ListAssessment from "./readability/ListAssessment";

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

// SEO assessments (premium)
import KeyphraseDistributionAssessment from "./seo/KeyphraseDistributionAssessment";
import TextTitleAssessment from "./seo/TextTitleAssessment";

// SEO assessments (product)
import ImageAltTagsAssessment from "./seo/ImageAltTagsAssessment";
import ProductIdentifiersAssessment from "./seo/ProductIdentifiersAssessment";
import ProductSKUAssessment from "./seo/ProductSKUAssessment";

import InclusiveLanguageAssessment from "./inclusiveLanguage/InclusiveLanguageAssessment";

const readability = {
	ListAssessment,
	ParagraphTooLongAssessment,
	PassiveVoiceAssessment,
	SentenceBeginningsAssessment,
	SentenceLengthInTextAssessment,
	SubheadingDistributionTooLongAssessment,
	TextAlignmentAssessment,
	TextPresenceAssessment,
	TransitionWordsAssessment,
	WordComplexityAssessment,
};

// We expose the deprecated assessments for backwards compatibility.
const seo = {
	FunctionWordsInKeyphraseAssessment,
	ImageAltTagsAssessment,
	ImageCountAssessment,
	ImageKeyphraseAssessment,
	InternalLinksAssessment,
	IntroductionKeywordAssessment,
	KeyphraseDistributionAssessment,
	KeyphraseInSEOTitleAssessment,
	KeyphraseLengthAssessment,
	KeyphraseDensityAssessment,
	KeywordDensityAssessment,
	MetaDescriptionKeywordAssessment,
	MetaDescriptionLengthAssessment,
	OutboundLinksAssessment,
	PageTitleWidthAssessment,
	ProductIdentifiersAssessment,
	ProductSKUAssessment,
	SingleH1Assessment,
	SubheadingsKeywordAssessment,
	TextCompetingLinksAssessment,
	TextLengthAssessment,
	TextTitleAssessment,
	SlugKeywordAssessment,
	UrlKeywordAssessment,
};

const inclusiveLanguage = {
	InclusiveLanguageAssessment,
};

export {
	readability,
	seo,
	inclusiveLanguage,
};
