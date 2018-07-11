const FleschReadingEase = require( "./readability/fleschReadingEaseAssessment" );
const ParagraphTooLong = require( "./readability/paragraphTooLongAssessment" );
const PassiveVoice = require( "./readability/passiveVoiceAssessment" );
const SentenceBeginnings = require( "./readability/sentenceBeginningsAssessment" );
const SentenceLengthInDescription = require( "./readability/sentenceLengthInDescriptionAssessment" );
const SentenceLengthInText = require( "./readability/sentenceLengthInTextAssessment" );
const SubheadingDistributionTooLong = require( "./readability/subheadingDistributionTooLongAssessment" );
const TextPresence = require( "./readability/textPresenceAssessment" );
const TransitionWords = require( "./readability/transitionWordsAssessment" );
const WordComplexity = require( "./readability/wordComplexityAssessment" );

const InternalLinks = require( "./seo/internalLinksAssessment" );
const IntroductionKeyword = require( "./seo/introductionKeywordAssessment" );
const KeyphraseLength = require( "./seo/keyphraseLengthAssessment" );
const KeywordDensity = require( "./seo/keywordDensityAssessment" );
const KeywordStopWords = require( "./seo/keywordStopWordsAssessment" );
const LargestKeywordDistance = require( "./seo/largestKeywordDistanceAssessment" );
const MetaDescriptionKeyword = require( "./seo/metaDescriptionKeywordAssessment" );
const MetaDescriptionLength = require( "./seo/metaDescriptionLengthAssessment" );
const OutboundLinks = require( "./seo/outboundLinksAssessment" );
const PageTitleWidth = require( "./seo/pageTitleWidthAssessment" );
const SubheadingsKeyword = require( "./seo/subheadingsKeywordAssessment" );
const TaxonomyTextLength = require( "./seo/taxonomyTextLengthAssessment" );
const TextCompetingLinks = require( "./seo/textCompetingLinksAssessment" );
const TextImages = require( "./seo/textImagesAssessment" );
const TextLength = require( "./seo/textLengthAssessment" );
const TitleKeyword = require( "./seo/titleKeywordAssessment" );
const UrlKeyword = require( "./seo/urlKeywordAssessment" );
const UrlLength = require( "./seo/urlLengthAssessment" );
const UrlStopWords = require( "./seo/urlStopWordsAssessment" );

const readability = {
	FleschReadingEase,
	ParagraphTooLong,
	PassiveVoice,
	SentenceBeginnings,
	SentenceLengthInDescription,
	SentenceLengthInText,
	SubheadingDistributionTooLong,
	TextPresence,
	TransitionWords,
	WordComplexity,
};

const seo = {
	InternalLinks,
	IntroductionKeyword,
	KeyphraseLength,
	KeywordDensity,
	KeywordStopWords,
	LargestKeywordDistance,
	MetaDescriptionKeyword,
	MetaDescriptionLength,
	OutboundLinks,
	PageTitleWidth,
	SubheadingsKeyword,
	TaxonomyTextLength,
	TextCompetingLinks,
	TextImages,
	TextLength,
	TitleKeyword,
	UrlKeyword,
	UrlLength,
	UrlStopWords,
};

export {
	readability,
	seo,
};
