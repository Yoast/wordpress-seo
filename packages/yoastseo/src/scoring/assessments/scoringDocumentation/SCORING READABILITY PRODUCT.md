# Overview of the Readability assessments scoring criteria
These are the scoring criteria applied when using the product pages content assessor.

Readability analysis is a collection of assessments that check how easy to read a text is.

Some of the readability assessments are language-independent (e.g. paragraph length, subheading distribution), but many are language-specific (e.g. passive voice, transition words) and are made available for different languages on a case-by-case basis.
For more information on each language, you can check the documentation on [which language-specific assessments have been adapted to which languages](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo/README.md#readability-analysis).

For information on how the assessments scoring system works, check out these explanations:
* [How are individual traffic lights assigned?](SCORING%20READABILITY.md#how-are-individual-traffic-lights-assigned)
* [How is the overall score calculated?](SCORING%20READABILITY.md#how-is-the-overall-score-calculated)

**Note on URLs in feedback texts**: The URLs used in the feedback texts differ between WordPress and Shopify (the URLs are different but they lead to the same pages).
In this document, only the shortlinks used in WordPress are listed.

## Scoring criteria for the readability assessments
### Assessments with the same scoring criteria as with the regular SEO assessor
* [Subheading distribution](SCORING%20READABILITY.md#1-subheading-distribution)
* [Sentence length](SCORING%20READABILITY.md#3-sentence-length)
* [Passive voice](SCORING%20READABILITY.md#5-passive-voice)
* [Transition words](SCORING%20READABILITY.md#6-transition-words)
* [Text presence](SCORING%20READABILITY.md#7-text-presence)
* [Word complexity](SCORING%20READABILITY.md#8-word-complexity-only-in-premium) (only in combination with Premium in WordPress, or in Shopify)

### Assessments with different scoring criteria than with the regular SEO assessor
### 1) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: Always.

**Name in code**: ParagraphTooLongAssessment

**Title URL**: [https://yoa.st/35d](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35e](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion                                               | Feedback                                                                                                                                            |
|------------|------------------	|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red        |3	                | > 100 words (Japanese: 200 characters)	   	             | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (X). **Shorten your paragraphs!** |
| Orange     |6                 | Between 70 and 100 words (Japanese: 140-200 characters) | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (X). **Shorten your paragraphs!** |
| Green      |9                 | ≤ 70 words (Japanese: 140 characters)	                  | **Paragraph length**: There are no paragraphs that are too long. Great job!                                                                         |

### Assessments unique to product pages
### 1) Lists
**What it does**: Checks if there is a list in the text.

**When applies**: Always.

**Name in code**: ListAssessment

**Title URL**: https://yoa.st/4fe (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/4ff (link placement is in bold in the feedback strings)

| Traffic light | Score   | Criterion         | Feedback                                                                                   |
|---------------|---------|-------------------|--------------------------------------------------------------------------------------------|
| Red           | 3     	 | No list	         | **Lists**: No lists appear on this page. **Add at least one ordered or unordered list**.   |
| Green         | 9     	 | At least one list | **Lists**: There is at least one list on this page. Great!                                 |

### Unavailable assessments
The following assessments are not available for product pages:
* Consecutive sentences (removed because we expect product pages to have more descriptive texts, in which repetition is okay)
