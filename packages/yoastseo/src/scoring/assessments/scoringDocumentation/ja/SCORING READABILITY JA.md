# Overview of the Readability assessments scoring criteria for Japanese

Readability analysis is a collection of assessments that check how easy to read a text is.

This file describes the language-specific scoring criteria for readability assessments in Japanese. To find more general information on the scoring criteria of the readability assessments, you can consult the following pages:
* [Scoring criteria for readability assessments](../SCORING%20READABILITY.md)

## Scoring criteria for the readability assessments
### 1) Subheading distribution
**What it does**: Checks whether long texts are divided by subheadings.

**When applies**: Always.

**Name in code**: SubheadingsDistributionTooLong

**Title URL**: [https://yoa.st/34x](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheading-distributrion-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34y](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheading-distributrion-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion | Feedback                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-----------------|------------------	|--------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red             |2	| A text with more than 600 characters (cornerstone: 500) and no subheading is present. | **Subheading distribution**: You are not using any subheadings, although your text is rather long. Try and add some subheadings.                                                                                                                                                                                                                                                                                           |
| Red             |3	| There is subheading(s) in the text and it is followed and preceded (if applicable) by more than 700 characters (cornerstone: 600).| **Subheading distribution**: X sections of your text are longer than the recommended number of characters (X) and are not separated by any subheadings. Add subheadings to improve readability. |
| Red             |3	| There is subheading(s) in the text in which the first one is preceded by a text longer than 700 characters (cornerstone: 600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).  | **Subheading distribution**: The beginning of your text is longer than X characters and is not separated by any subheadings. Add subheadings to improve readability.                                                       |
| Orange          |6 | Subheading followed by 600-700 characters (cornerstone: 500-600) | **Subheading distribution**: X sections of your text are longer than the recommended number of characters (X) and are not separated by any subheadings. Add subheadings to improve readability. |
| Orange          |6	| There is subheading(s) in the text in which the first one is preceded by a text between 600-700 characters (cornerstone: 500-600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).   **Subheading distribution**: The beginning of your text is longer than X characters and is not separated by any subheadings. Add subheadings to improve readability.                                                       |
| Green           |9 | A text with 600 or less characters and no subheading is present. | **Subheading distribution**: You are not using any subheadings, but your text is short enough and probably doesn't need them.                                                                                                                                                                                                                                                                                              |
| Green           |9 | There is subheading(s) in the text and it is followed and preceded (if applicable) by less than 600 characters (cornerstone: 500). | **Subheading distribution**:  Great job!                                                                                                                                                                                                                                                                                                                                                                                   |

### 2) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: Always.

**Name in code**: ParagraphTooLongAssessment

**Title URL**: [https://yoa.st/35d](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35e](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion                             | Feedback                                                                                                                                      |
|------------|------------------	|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Red        |3	                | > 400 characters	   	                 | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of characters (X). **Shorten your paragraphs!** |
| Orange     |6                 | Between 300 and 400 characters        | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of characters (X). **Shorten your paragraphs!** |
| Green      |9                 | ≤ 300 characters	 | **Paragraph length**: There are no paragraphs that are too long. Great job!                                                                   |

### 3) Sentence length
**What it does**: Checks whether the sentences exceed the recommended maximum length (40 characters).

**When applies**: Always.

**Name in code**: SentenceLengthInTextAssessment

**Title URL**: [https://yoa.st/34v](https://yoast.com/the-sentence-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-length-in-text-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34w](https://yoast.com/the-sentence-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-length-in-text-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light |	Score |	Criterion | 	Feedback                                                                                                                                                   |
|------------------  |------------------	|--------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Red	| 3 |> 30% (cornerstone: 25%)                                                  | **Sentence length**: X of the sentences contain more than X characters, which is more than the recommended maximum of X%. **Try to shorten the sentences**. |
|Orange	| 6 |Between 25 and 30% (cornerstone: 20-25%) | **Sentence length**: X of the sentences contain more than X characters, which is more than the recommended maximum of X%. **Try to shorten the sentences**. |
|Green	| 9 |≤ 25% (cornerstone: ≤ 20%)                                 | **Sentence length**: great!                                                                                                                                 |


### 4) Transition words
**What it does**: Checks whether there are enough sentences containing transition words.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: TransitionWordsAssessment

**Title URL**: [https://yoa.st/34z](https://yoast.com/transition-words-why-and-how-to-use-them/#utm_source=yoast-seo&utm_medium=software&utm_term=transition-words-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35a](https://yoast.com/transition-words-why-and-how-to-use-them/#utm_source=yoast-seo&utm_medium=software&utm_term=transition-words-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score	| Criterion                                                                                                      |	Feedback|
|-------|------	|----------------------------------------------------------------------------------------------------------------|------- |
|Red	|3| 	No transition words found in a long text (more than 400 characters)	                                          |**Transition words**: None of the sentences contain transition words. **Use some**.|
|Red	|3| 	< 20% of sentences in a long text (more than 400 characters)	                                                 |**Transition words**: Only X of the sentences contain them. This is not enough. **Use more transition words**.|
|Orange	|6| 	Between 20 and 30% of sentences in a long text (more than 400 characters)                         |**Transition words**: Only X of the sentences contain them. This is not enough. **Use more transition words**.|
|Green	|9| 	≥ 30% of sentences in a long text (more than 400 characters)                           |**Transition words**: Well done!|
|Green	|9| 	At least one sentence with transition words in a short text (less than 400 characters) |**Transition words**: Well done!|
|Green	|9| 	No transition words found in a short text (less than 400 characters)                   |**Transition words**: You are not using any transition words, but your text is short enough and probably doesn't need them.|


### 5) Text presence
**What it does**: Checks whether there is enough text in the copy

**Name in code**: TextPresenceAssessment

**Title URL**: [https://yoa.st/35h](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-presence-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35i](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-presence-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score|	Criterion|	Feedback|
|-------|------	|----- |------- |
|Red	|3	|< 50 characters	|**Not enough content**: **please add some content to enable a good analysis**.|

