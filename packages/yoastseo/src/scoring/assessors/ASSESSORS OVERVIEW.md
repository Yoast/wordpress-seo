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
- Keyphrase in SEO title (`KeyphraseInSEOTitleAssessment`)
- Keyphrase in slug (`UrlKeywordAssessment`)
- Meta description length (`MetaDescriptionLengthAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20SEO.md#5-meta-description-length)
- Keyphrase in subheadings (`SubHeadingsKeywordAssessment`)
- Images (`ImageCountAssessment`)
- Image keyphrase (`KeyphraseInImageTextAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20SEO.md#7-image-keyphrase)
- Text length (`TextLengthAssessment`) -> [Cornerstone scores and boundaries!](../assessments/SCORING%20SEO.md#1-text-length)
- Outbound links (`OutboundLinksAssessment`)
- SEO title width (`PageTitleWidthAssesment`)
- Function words in keyphrase (`FunctionWordsInKeyphraseAssessment`)
- Previously used keyphrase (`previouslyUsedKeywords`)
- Single title (`SingleH1Assessment`)
### Taxonomy assessor
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Keyphrase in SEO title (`KeyphraseInSEOTitleAssessment`)
- Keyphrase in slug (`UrlKeywordAssessment`)
- Meta description length (`MetaDescriptionLengthAssessment`)
- Text length (`TextLengthAssessment`)
- SEO Title width (`PageTitleWidthAssesment`)
- Function words in keyphrase (`FunctionWordsInKeyphrase`)
- Previously used Keyphrase (`previouslyUsedKeywords`)
- Single title (`SingleH1Assessment`)
### Related keywords (all keywords after the first)
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Image keyphrase (`KeyphraseInImageTextAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20SEO.md#7-image-keyphrase)
- Competing links (`TextCompetingLinksAssessment`)
- Previously used keyphrase (`previouslyUsedKeywords`)
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
- Subheading distribution (`SubheadingDistributionTooLongAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20READABILITY.md#1-subheading-distribution)
- Paragraph length (`ParagraphTooLongAssessment`)
- Sentence length (`SentenceLengthInTextAssessment`) -> [Cornerstone values!](../assessments/SCORING%20READABILITY.md#1-subheading-distribution)
- Consecutive sentences (`SentenceBeginningsAssessment`)
- Transition words (`TransitionWordsAssessment`)
- Passive voice (`PassiveVoiceAssessment`)
- Text presence (`TextPresenceAssessment`)
### Premium
- Word complexity (`WordComplexityAssessment`) -> [Cornerstone values!](../assessments/SCORING%20READABILITY.md#8-word-complexity)
- Alignment (`TextAlignmentAssessment`)

## Inclusive language assessor
- Inclusive language assessment (`InclusiveLanguageAssessment`)
