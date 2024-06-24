# Assessor types
## SEO Assessors
### Which assessor?
Overview of the used SEO assessors in the `yoastseo` package:

![Overview of the SEO assessors](/packages/yoastseo/images/assessorsOverview.png)
### Standard SEO assessor (Focus keyphrase)
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in metadescription (`MetaDescriptionKeywordAssessment`)
- Competing links (`TextCompetingLinksAssessment`)
- Internal links (`InternalLinksAssessment`)
- Page title keyphrase assessment (`KeyphraseInSEOTitleAssessment`)
- Slug keyphrase assessment (`SlugKeywordAssessment`)
- Length of meta description (`MetaDescriptionLengthAssessment`) -> [Cornerstone scores!](https://github.com/Yoast/wordpress-seo/blob/LINGO-498-move-documentation-from-wiki-to-readme-files-on-repo/packages/yoastseo/src/scoring/assessments/seo/README.md#meta-description-length)
- Keyphrase in subheadings (`SubHeadingsKeywordAssessment`)
- Images (`ImageCountAssessment`)
- Keyphrase in image alt attributes (`ImageKeyphraseAssessment`) -> [Cornerstone scores!](https://github.com/Yoast/javascript/wiki/Scoring-SEO-analysis#8-keyphrase-in-text-images)
- Text length (`TextLengthAssessment`) -> [Cornerstone scores and boundaries!](https://github.com/Yoast/wordpress-seo/blob/LINGO-498-move-documentation-from-wiki-to-readme-files-on-repo/packages/yoastseo/src/scoring/assessments/seo/README.md#text-length)
- Outbound links (`OutboundLinksAssessment`) -> [Cornerstone scores!](https://github.com/Yoast/wordpress-seo/blob/LINGO-498-move-documentation-from-wiki-to-readme-files-on-repo/packages/yoastseo/src/scoring/assessments/seo/README.md#outbound-links)
- Title width (`PageTitleWidthAssesment`) -> [Cornerstone scores!](https://github.com/Yoast/wordpress-seo/blob/LINGO-498-move-documentation-from-wiki-to-readme-files-on-repo/packages/yoastseo/src/scoring/assessments/seo/README.md#seo-title-width)
- Keyphrase consists of function words only (`FunctionWordsInKeyphrase`)
- Previously used keyphrase (`previouslyUsedKeywords`)
- Single H1 assessment
### Taxonomy assessor
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Page title keyword assessment (`KeyphraseInSEOTitleAssessment`)
- Slug Keyphrase assessment (`SlugKeywordAssessment`)
- Length of meta description (`MetaDescriptionLengthAssessment`)
- Taxonomy text length (`taxonomyTextLengthAssessment`)
- Title width (`PageTitleWidthAssesment`)
- Keyphrase consists of function words only (`FunctionWordsInKeyphrase`)
- Previously used Keyphrase (`previouslyUsedKeywords`)
- Single H1 assessment
### Related keywords (all keywords after the first)
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Keyphrase in image alt attributes (`textImagesAssessment`)
- Competing links (`TextCompetingLinksAssessment`)
- Previously used Keyphrase (`previouslyUsedKeywords`)
### Related keywords taxonomy
- Keyphrase in introduction (`IntroductionKeywordAssessment)`
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Previously used keyphrase (`previouslyUsedKeywords`)
### Premium
- Keyphrase distribution (not of related keywords)
- Title (`TextTitleAssessment`)

## Content Assessors
### Standard Content (Readability) assessor
- Subheading distribution (`SubheadingDistributionTooLong`) -> [Cornerstone scores!](https://github.com/Yoast/wordpress-seo/blob/LINGO-498-move-documentation-from-wiki-to-readme-files-on-repo/packages/yoastseo/src/scoring/assessments/SCORING%20READABILITY.md#1-subheading-distribution)
- Paragraph length (`ParagraphTooLongAssessment`)
- Sentence length (`SentenceLengthInTextAssessment`) -> [Cornerstone values!](https://github.com/Yoast/wordpress-seo/blob/LINGO-498-move-documentation-from-wiki-to-readme-files-on-repo/packages/yoastseo/src/scoring/assessments/SCORING%20READABILITY.md#3-sentence-length)
- Consecutive sentences (`SentenceBeginningsAssessment`)
- Transition words (`TransitionWordsAssessment`)
- Passive voice (`PassiveVoiceAssessment`)
- Text presence (`TextPresenceAssessment`)
- Flesch Reading Ease (`FleschReadingEaseAssessment`)
### Premium
- Word complexity (`WordComplexityAssessment`) -> [Cornerstone values!](SCORING%20READABILITY.md#8-word-complexity)
- Alignment (`TextAlignmentAssessment`)

## Inclusive language assessor
- Inclusive language assessment (`InclusiveLanguageAssessment`)
