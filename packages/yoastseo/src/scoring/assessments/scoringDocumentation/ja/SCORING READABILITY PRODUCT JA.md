# Overview of the Readability assessments scoring criteria
These are the scoring criteria applied when using the product pages content assessor in Japanese.

Readability analysis is a collection of assessments that check how easy to read a text is.

This file describes the Japanese scoring criteria for readability assessments on product pages. Not all assessments have language-specific scoring criteria in Japanese. To find general information on readability assessments on product pages, you can consult the following page:
* [Scoring criteria for readability assessments on product pages](../SCORING%20READABILITY%20PRODUCT.md)

## Scoring criteria for the readability assessments
### Assessments with the same language-specific scoring criteria as with the readability assessor for posts and pages
* [Subheading distribution](SCORING%20READABILITY%20JA.md#1-subheading-distribution)
* [Sentence length](SCORING%20READABILITY%20JA.md#3-sentence-length)
* [Transition words](SCORING%20READABILITY%20JA.md#4-transition-words)
* [Text presence](SCORING%20READABILITY%20JA.md#5-text-presence)

### Language-independent assessments that are unique to product pages
* [Lists](../SCORING%20READABILITY%20PRODUCT.md#1-lists)

### Assessments with a language-specific criteria different from the readability assessor for posts and pages
### 1) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: Always.

**Name in code**: ParagraphTooLongAssessment

**Title URL**: [https://yoa.st/35d](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35e](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion                             | Feedback                                                                                                                                              |
|------------|------------------	|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red        |3	                | > 200 characters	   	                 | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (140). **Shorten your paragraphs!** |
| Orange     |6                 | Between 140 and 200 characters | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (140). **Shorten your paragraphs!** |
| Green      |9                 | ≤ 140 characters	 | **Paragraph length**: There are no paragraphs that are too long. Great job!                                                                           |

### Unavailable assessments
The following assessments are not available for product pages:
* [Consecutive sentences](../SCORING%20READABILITY.md#4-consecutive-sentences) (removed because we expect product pages to have more descriptive texts, in which repetition is okay)

The following assessments are not available for pages in Japanese:
* [Passive voice](../SCORING%20READABILITY.md#5-passive-voice)
* [Word complexity](../SCORING%20READABILITY.md#8-word-complexity-only-in-premium)
