import FleschReadingEaseAssessment from "./readability/fleschReadingEaseAssessment";
import ListAssessment from "./readability/ListAssessment";
import ParagraphTooLongAssessment from "./readability/ParagraphTooLongAssessment";
import PassiveVoiceAssessment from "./readability/PassiveVoiceAssessment";
import SentenceBeginningsAssessment from "./readability/SentenceBeginningsAssessment";
import SentenceLengthInTextAssessment from "./readability/SentenceLengthInTextAssessment";
import SubheadingDistributionTooLongAssessment from "./readability/SubheadingDistributionTooLongAssessment";
import TextPresenceAssessment from "./readability/TextPresenceAssessment";
import TransitionWordsAssessment from "./readability/TransitionWordsAssessment";
import WordComplexityAssessment from "./readability/wordComplexityAssessment";

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
import TitleKeywordAssessment from "./seo/TitleKeywordAssessment";
import { SlugKeywordAssessment, UrlKeywordAssessment } from "./seo/UrlKeywordAssessment";
import ImageKeyphraseAssessment from "./seo/KeyphraseInImageTextAssessment";
import ImageCountAssessment from "./seo/ImageCountAssessment";
import ImageAltTagsAssessment from "./seo/ImageAltTagsAssessment";

const readability = {
	FleschReadingEaseAssessment,
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
	TitleKeywordAssessment,
	SlugKeywordAssessment,
	UrlKeywordAssessment,
	ImageKeyphraseAssessment,
	ImageCountAssessment,
	ImageAltTagsAssessment,
};

export {
	readability,
	seo,
};
