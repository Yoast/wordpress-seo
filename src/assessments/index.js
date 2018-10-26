import FleschReadingEaseAssessment from "./readability/fleschReadingEaseAssessment";
import ParagraphTooLongAssessment from "./readability/paragraphTooLongAssessment";
import PassiveVoiceAssessment from "./readability/passiveVoiceAssessment";
import SentenceBeginningsAssessment from "./readability/sentenceBeginningsAssessment";
import SentenceLengthInDescriptionAssessment from "./readability/sentenceLengthInDescriptionAssessment";
import SentenceLengthInTextAssessment from "./readability/sentenceLengthInTextAssessment";
import SubheadingDistributionTooLongAssessment from "./readability/subheadingDistributionTooLongAssessment";
import TextPresenceAssessment from "./readability/textPresenceAssessment";
import TransitionWordsAssessment from "./readability/transitionWordsAssessment";
import WordComplexityAssessment from "./readability/wordComplexityAssessment";

import InternalLinksAssessment from "./seo/InternalLinksAssessment";
import IntroductionKeywordAssessment from "./seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./seo/KeywordDensityAssessment";
import KeywordStopWordsAssessment from "./seo/keywordStopWordsAssessment";
import KeyphraseDistributionAssessment from "./seo/KeyphraseDistributionAssessment";
import MetaDescriptionKeywordAssessment from "./seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "./seo/metaDescriptionLengthAssessment";
import OutboundLinksAssessment from "./seo/outboundLinksAssessment";
import PageTitleWidthAssessment from "./seo/pageTitleWidthAssessment";
import SubheadingsKeywordAssessment from "./seo/SubHeadingsKeywordAssessment";
import TaxonomyTextLengthAssessment from "./seo/taxonomyTextLengthAssessment";
import TextCompetingLinksAssessment from "./seo/TextCompetingLinksAssessment";
import TextImagesAssessment from "./seo/textImagesAssessment";
import TextLengthAssessment from "./seo/textLengthAssessment";
import TitleKeywordAssessment from "./seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./seo/UrlKeywordAssessment";
import UrlLengthAssessment from "./seo/urlLengthAssessment";
import UrlStopWordsAssessment from "./seo/urlStopWordsAssessment";

const readability = {
	FleschReadingEaseAssessment,
	ParagraphTooLongAssessment,
	PassiveVoiceAssessment,
	SentenceBeginningsAssessment,
	SentenceLengthInDescriptionAssessment,
	SentenceLengthInTextAssessment,
	SubheadingDistributionTooLongAssessment,
	TextPresenceAssessment,
	TransitionWordsAssessment,
	WordComplexityAssessment,
};

const seo = {
	InternalLinksAssessment,
	IntroductionKeywordAssessment,
	KeyphraseLengthAssessment,
	KeywordDensityAssessment,
	KeywordStopWordsAssessment,
	KeyphraseDistributionAssessment,
	MetaDescriptionKeywordAssessment,
	MetaDescriptionLengthAssessment,
	OutboundLinksAssessment,
	PageTitleWidthAssessment,
	SubheadingsKeywordAssessment,
	TaxonomyTextLengthAssessment,
	TextCompetingLinksAssessment,
	TextImagesAssessment,
	TextLengthAssessment,
	TitleKeywordAssessment,
	UrlKeywordAssessment,
	UrlLengthAssessment,
	UrlStopWordsAssessment,
};

export {
	readability,
	seo,
};
