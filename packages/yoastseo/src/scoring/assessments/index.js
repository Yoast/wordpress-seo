import FleschReadingEaseAssessment from "./readability/fleschReadingEaseAssessment";
import ParagraphTooLongAssessment from "./readability/paragraphTooLongAssessment";
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
import TextImagesAssessment from "./seo/TextImagesAssessment";
import TextLengthAssessment from "./seo/TextLengthAssessment";
import TitleKeywordAssessment from "./seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./seo/UrlKeywordAssessment";

const readability = {
	FleschReadingEaseAssessment,
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
	TextImagesAssessment,
	TextLengthAssessment,
	TitleKeywordAssessment,
	UrlKeywordAssessment,
};

export {
	readability,
	seo,
};
