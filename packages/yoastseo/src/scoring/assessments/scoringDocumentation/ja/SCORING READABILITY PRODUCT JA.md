# Overview of the Readability assessments scoring criteria
These are the scoring criteria applied when using the product pages content assessor in Japanese.

Readability analysis is a collection of assessments that check how easy to read a text is.

This file describes the Japanese scoring criteria for readability assessments on product pages. Not all assessments have language-specific scoring criteria in Japanese. To find general information on readability assessments on product pages, you can consult the following page:
* [Scoring criteria for readability assessments on product pages](../SCORING%20READABILITY%20PRODUCT.md)

### Assessments with a language specific scoring criteria that is different from the regular SEO assessor
### 1) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: Always.

**Name in code**: ParagraphTooLongAssessment

**Title URL**: [https://yoa.st/35d](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35e](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion                             | Feedback                                                                                                                                            |
|------------|------------------	|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red        |3	                | > 200 characters	   	                 | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (X). **Shorten your paragraphs!** |
| Orange     |6                 | Between 140 and 200 characters | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (X). **Shorten your paragraphs!** |
| Green      |9                 | ≤ 140 characters	 | **Paragraph length**: There are no paragraphs that are too long. Great job!                                                                         |

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
