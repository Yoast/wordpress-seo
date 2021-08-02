import FleschReadingEaseAssessment from "./readability/fleschReadingEaseAssessment";
import ListAssessment from "./readability/ListAssessment";
import ParagraphTooLongAssessment from "./readability/ParagraphTooLongAssessment";
import PassiveVoiceAssessment from "./readability/passiveVoiceAssessment";
import SentenceBeginningsAssessment from "./readability/sentenceBeginningsAssessment";
import SentenceLengthInTextAssessment from "./readability/sentenceLengthInTextAssessment";
import SubheadingDistributionTooLongAssessment from "./readability/subheadingDistributionTooLongAssessment";
import TextPresenceAssessment from "./readability/textPresenceAssessment";
import TransitionWordsAssessment from "./readability/transitionWordsAssessment";
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
import UrlKeywordAssessment from "./seo/UrlKeywordAssessment";
import ImageKeyphraseAssessment from "./seo/KeyphraseInImageTextAssessment";
import ImageCountAssessment from "./seo/ImageCountAssessment";

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
	UrlKeywordAssessment,
	ImageKeyphraseAssessment,
	ImageCountAssessment,
};

export {
	readability,
	seo,
};
