// Readbility assessments.
import ListAssessment from "./readability/ListAssessment";
import ParagraphTooLongAssessment from "./readability/ParagraphTooLongAssessment";
import PassiveVoiceAssessment from "./readability/PassiveVoiceAssessment";
import SentenceBeginningsAssessment from "./readability/SentenceBeginningsAssessment";
import SentenceLengthInTextAssessment from "./readability/SentenceLengthInTextAssessment";
import SubheadingDistributionTooLongAssessment from "./readability/SubheadingDistributionTooLongAssessment";
import TextPresenceAssessment from "./readability/TextPresenceAssessment";
import TransitionWordsAssessment from "./readability/TransitionWordsAssessment";
import WordComplexityAssessment from "./readability/WordComplexityAssessment";

// SEO assessments.
import FunctionWordsInKeyphraseAssessment from "./seo/FunctionWordsInKeyphraseAssessment";
import InternalLinksAssessment from "./seo/InternalLinksAssessment";
import IntroductionKeywordAssessment from "./seo/IntroductionKeywordAssessment";
import KeyphraseDistributionAssessment from "./seo/KeyphraseDistributionAssessment";
import KeyphraseLengthAssessment from "./seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./seo/KeywordDensityAssessment";
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
import ImageAltTagsAssessment from "./seo/ImageAltTagsAssessment";
import ProductIdentifiersAssessment from "./seo/ProductIdentifiersAssessment";
import ProductSKUAssessment from "./seo/ProductSKUAssessment";

const readability = {
	ListAssessment,
	ParagraphTooLongAssessment,
	PassiveVoiceAssessment,
	SentenceBeginningsAssessment,
	SentenceLengthInTextAssessment,
	SubheadingDistributionTooLongAssessment,
	TextPresenceAssessment,
	TransitionWordsAssessment,
	WordComplexityAssessment,
};

// We expose the deprecated UrlKeywordAssessment for backwards compatibility.
const seo = {
	FunctionWordsInKeyphraseAssessment,
	InternalLinksAssessment,
	IntroductionKeywordAssessment,
	KeyphraseLengthAssessment,
	KeywordDensityAssessment,
	KeyphraseDistributionAssessment,
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
	ImageAltTagsAssessment,
	ProductIdentifiersAssessment,
	ProductSKUAssessment,
};

export {
	readability,
	seo,
};
