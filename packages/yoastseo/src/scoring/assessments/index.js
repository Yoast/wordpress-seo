// Readability assessments.
import ParagraphTooLongAssessment from "./readability/ParagraphTooLongAssessment.js";
import PassiveVoiceAssessment from "./readability/PassiveVoiceAssessment.js";
import SentenceBeginningsAssessment from "./readability/SentenceBeginningsAssessment.js";
import SentenceLengthInTextAssessment from "./readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLongAssessment from "./readability/SubheadingDistributionTooLongAssessment.js";
import TextPresenceAssessment from "./readability/TextPresenceAssessment.js";
import TransitionWordsAssessment from "./readability/TransitionWordsAssessment.js";

// Readability assessments (premium)
import TextAlignmentAssessment from "./readability/TextAlignmentAssessment.js";
import WordComplexityAssessment from "./readability/WordComplexityAssessment.js";

// Readability assessments (product)
import ListAssessment from "./readability/ListAssessment.js";

// SEO assessments.
import FunctionWordsInKeyphraseAssessment from "./seo/FunctionWordsInKeyphraseAssessment.js";
import InternalLinksAssessment from "./seo/InternalLinksAssessment.js";
import IntroductionKeywordAssessment from "./seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "./seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment, { KeywordDensityAssessment } from "./seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "./seo/MetaDescriptionKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "./seo/MetaDescriptionLengthAssessment.js";
import OutboundLinksAssessment from "./seo/OutboundLinksAssessment.js";
import PageTitleWidthAssessment from "./seo/PageTitleWidthAssessment.js";
import SingleH1Assessment from "./seo/SingleH1Assessment.js";
import SubheadingsKeywordAssessment from "./seo/SubHeadingsKeywordAssessment.js";
import TextCompetingLinksAssessment from "./seo/TextCompetingLinksAssessment.js";
import TextLengthAssessment from "./seo/TextLengthAssessment.js";
import KeyphraseInSEOTitleAssessment from "./seo/KeyphraseInSEOTitleAssessment.js";
import { SlugKeywordAssessment, UrlKeywordAssessment } from "./seo/UrlKeywordAssessment.js";
import ImageKeyphraseAssessment from "./seo/KeyphraseInImageTextAssessment.js";
import ImageCountAssessment from "./seo/ImageCountAssessment.js";
import AltTextLengthAssessment from "./seo/AltTextLengthAssessment.js";
import DuplicateAltTextAssessment from "./seo/DuplicateAltTextAssessment.js";
import RedundantPhraseInAltTextAssessment from "./seo/RedundantPhraseInAltTextAssessment.js";
import NonDescriptiveAltTextAssessment from "./seo/NonDescriptiveAltTextAssessment.js";
import KeyphraseStuffingInAltTextAssessment from "./seo/KeyphraseStuffingInAltTextAssessment.js";

// SEO assessments (premium)
import KeyphraseDistributionAssessment from "./seo/KeyphraseDistributionAssessment.js";
import TextTitleAssessment from "./seo/TextTitleAssessment.js";

// SEO assessments (product)
import ImageAltTagsAssessment from "./seo/ImageAltTagsAssessment.js";
import ProductIdentifiersAssessment from "./seo/ProductIdentifiersAssessment.js";
import ProductSKUAssessment from "./seo/ProductSKUAssessment.js";

import InclusiveLanguageAssessment from "./inclusiveLanguage/InclusiveLanguageAssessment.js";

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
	AltTextLengthAssessment,
	DuplicateAltTextAssessment,
	FunctionWordsInKeyphraseAssessment,
	ImageAltTagsAssessment,
	ImageCountAssessment,
	ImageKeyphraseAssessment,
	InternalLinksAssessment,
	IntroductionKeywordAssessment,
	KeyphraseDistributionAssessment,
	KeyphraseInSEOTitleAssessment,
	KeyphraseLengthAssessment,
	KeyphraseStuffingInAltTextAssessment,
	KeyphraseDensityAssessment,
	KeywordDensityAssessment,
	MetaDescriptionKeywordAssessment,
	MetaDescriptionLengthAssessment,
	NonDescriptiveAltTextAssessment,
	OutboundLinksAssessment,
	PageTitleWidthAssessment,
	ProductIdentifiersAssessment,
	ProductSKUAssessment,
	RedundantPhraseInAltTextAssessment,
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
