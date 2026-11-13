# Overview of the assessment scoring criteria on taxonomy pages in Japanese

This file describes the Japanese scoring criteria for SEO assessments on taxonomy pages in Japanese. Not all assessments have language-specific scoring criteria in Japanese. To find more general information on the scoring criteria of the SEO assessments on taxonomy pages, you can consult the following page:
* [Scoring criteria for SEO assessments on taxonomy pages](../SCORING%20TAXONOMY.md)

### Assessments with the same language-specific scoring criteria as with the assessor for posts and pages
- [Keyphrase length](SCORING%20SEO%20JA.md#1-keyphrase-length)

### Assessments with the same scoring criteria as with the assessor for posts and pages
- [Keyphrase in introduction](../SCORING%20SEO.md#1-keyphrase-in-introduction)
- [Keyphrase density](../SCORING%20SEO.md#3-keyphrase-density)
- [Keyphrase in meta description](../SCORING%20SEO.md#4-keyphrase-in-meta-description)
- [Keyphrase in SEO title](../SCORING%20SEO.md#8-keyphrase-in-seo-title)
- [SEO title width](../SCORING%20SEO.md#4-seo-title-width)
- [Single title](../SCORING%20SEO.md#6-single-title)
- [Function words in keyphrase](../SCORING%20SEO.md#7-function-words-in-keyphrase)

## Assessments with a language-specific criteria different from the assessor for posts and pages
### 1) Text length assessment
**What it does**: Checks if the taxonomy page has a good length.

**When applies**: Always.

**Name in code**: TextLengthAssessment

**Title URL**: https://yoa.st/34j (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/34k (link placement is in bold in the feedback strings)

| Traffic light	 | Score	| Criterion	                                    | Feedback                                                                                                                                           |
|----------------|------------------	|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	           | -20	| 0 characters	                                 | Text length: Please add some content.                                                                                                              |
| Red	           | 3	| From 1 to 19 characters                       | Text length: The text contains X characters. This is below the recommended minimum of 60 characters. Add more content.          |
| Orange         | 6	| From 20 to 59 characters                      | Text length: The text contains X characters. This is slightly below the recommended minimum of 60 characters. Add more content. |
| Green	         | 9	| 60 characters or more	 | Text length: The text contains X characters. Good job!                                                                                       |

### 2) Meta description length assessment
**What it does**: Checks if the meta description has a good length. In a taxonomy page, the date is not displayed or included in the meta description. Hence, the date length is not included in the calculation for this assessment.

**When applies**: Always.

**Name in code**: MetaDescriptionLengthAssessment

**Title URL**: [https://yoa.st/34d](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=length-meta-description-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34e](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=length-meta-description-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	            | Score	     | Criterion                                                                    | Feedback |
|------------------------------|------------------	|------------------------------------------------------------------------------|---------------	|
| Red	                         | 1	| No meta description		                                                        | **Meta description length**: No meta description has been specified. Search engines will display copy from the page instead. **Make sure to write one!** |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		| Meta description ≤ 60 characters                                             | **Meta description length**: The meta description is too short (under X characters). Up to X characters are available. **Use the space!** |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		| Meta description ≥ 80 characters                                             | **Meta description length**: The meta description is over X characters. **To ensure the entire description will be visible, you should reduce the length!**	|
| Green	                       | 9	| Meta description > 60 and < 80 characters | **Meta description length**: Well done! |

## Unavailable assessments
The following assessments are not available for pages in Japanese:
* [Keyphrase in slug](../SCORING%20SEO.md#9-keyphrase-in-slug)
* [Inclusive language analysis](../SCORING%20INCLUSIVE%20LANGUAGE.md) (only available in English)
