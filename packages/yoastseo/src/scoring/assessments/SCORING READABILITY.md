# Overview of the Readability assessments scoring criteria

Readability analysis is a collection of assessments that check how easy to read a text is.

Some of the readability assessments are language-independent (e.g. paragraph length, subheading distribution), but many are language-specific (e.g. passive voice, transition words) and are made available for different languages on a case-by-case basis.
For more information on each language, you can check the documentation on [which language-specific assessments have been adapted to which languages](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo/README.md#readability-analysis).

## How are individual traffic lights assigned?
| Individual Score | Rating 	                        | Individual penalty points |
|------------	   |---------------------------------|---------------------|
|0 (if it is not explicitly set as a score) | Feedback (gray traffic light)		 |-	                        |
|0-4	                                	| Bad (red traffic light)		       |3 (partial support: 4)	    |
|5-7		                                | Ok (orange traffic light)	      |2	                        |
|8-10	                                    | Good (green traffic light)	     |0	                        |

## How is the overall score calculated?
| Sum of penalty points	 | Total score	| Divide by 10:|
|------------	         |------------------	|---------------------|
| 6 (partial: 4)         |30		            |3	                               |
| 4 (partial: 2)         |60		            |6	                               |
| <4 (partial: < 2)	     |90                    |9                                 |


## Scoring criteria for the readability assessments
### 1) Subheading distribution
**What it does**: Checks whether long texts are divided by subheadings.

**When applies**: Always.

**Name in code**: SubheadingsDistributionTooLong

**Title URL**: [https://yoa.st/34x](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheading-distributrion-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34y](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheading-distributrion-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion | Feedback                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-----------------|------------------	|--------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red             |2	| **Default**: A text with more than 300 words (cornerstone: 250) and no subheading is present. **Japanese**: A text with more than 600 characters (cornerstone: 500) and no subheading is present. | **Subheading distribution**: You are not using any subheadings, although your text is rather long. Try and add some subheadings.                                                                                                                                                                                                                                                                                           |
| Red             |3	| **Default**: There is subheading(s) in the text and it is followed and preceded (if applicable) by more than 350 words (cornerstone: 300). **Japanese**: There is subheading(s) in the text and it is followed and preceded (if applicable) by more than 700 characters (cornerstone: 600).| **DEFAULT**: **Subheading distribution**: X sections of your text are longer than the recommended number of words (X) and are not separated by any subheadings. Add subheadings to improve readability. <br> **JAPANESE:** **Subheading distribution**: X sections of your text are longer than the recommended number of characters (X) and are not separated by any subheadings. Add subheadings to improve readability. |
| Red             |3	| **Default**: There is subheading(s) in the text in which the first one is preceded by a text longer than 350 words (cornerstone: 300). And the texts following the subheading(s) is less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text in which the first one is preceded by a text longer than 700 characters (cornerstone: 600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).  | **DEFAULT:** **Subheading distribution**: The beginning of your text is longer than X words and is not separated by any subheadings. Add subheadings to improve readability. <br> **JAPANESE**: **Subheading distribution**: The beginning of your text is longer than X characters and is not separated by any subheadings. Add subheadings to improve readability.                                                       |
| Orange          |6 | **Default**: Subheading followed by 300-350 words (cornerstone: 250-300). **Japanese**: Subheading followed by 600-700 characters (cornerstone: 500-600) | **DEFAULT:** **Subheading distribution**: X sections of your text are longer than the recommended number of words (X) and are not separated by any subheadings. Add subheadings to improve readability. <br> **JAPANESE:** **Subheading distribution**: X sections of your text are longer than the recommended number of characters (X) and are not separated by any subheadings. Add subheadings to improve readability. |
| Orange          |6	| **Default**: There is subheading(s) in the text in which the first one is preceded by a text between 300-350 words (cornerstone: 250-300). And the texts following the subheading(s) is less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text in which the first one is preceded by a text between 600-700 characters (cornerstone: 500-600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).      | **DEFAULT:** **Subheading distribution**: The beginning of your text is longer than X words and is not separated by any subheadings. Add subheadings to improve readability. <br> **JAPANESE:** **Subheading distribution**: The beginning of your text is longer than X characters and is not separated by any subheadings. Add subheadings to improve readability.                                                       |
| Green           |9 | **Default**: A text with 300 or less words and no subheading is present. **Japanese**: A text with 600 or less characters and no subheading is present. | **Subheading distribution**: You are not using any subheadings, but your text is short enough and probably doesn't need them.                                                                                                                                                                                                                                                                                              |
| Green           |9 | **Default**: There is subheading(s) in the text and it is followed and preceded (if applicable) by less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text and it is followed and preceded (if applicable) by less than 600 characters (cornerstone: 500). | **Subheading distribution**:  Great job!                                                                                                                                                                                                                                                                                                                                                                                   |

### 2) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: Always.

**Name in code**: ParagraphTooLongAssessment

**Title URL**: [https://yoa.st/35d](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35e](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion                                                | Feedback                                                                                                                                            |
|------------|------------------	|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red        |3	                | > 200 words (Japanese: 400 characters)	   	              | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (X). **Shorten your paragraphs!** |
| Orange     |6                 | Between 150 and 200 words (Japanese: 300-400 characters) | **Paragraph length**: X of the paragraphs contain(s) more than the recommended maximum number of words/characters (X). **Shorten your paragraphs!** |
| Green      |9                 | ≤ 150 words (Japanese: 300 characters)	                  | **Paragraph length**: There are no paragraphs that are too long. Great job!                                                                         |

### 3) Sentence length
**What it does**: Checks whether the sentences exceed the recommended maximum length (default: 20 words, CA, ES, FA, IT, PT: 25 words, HE, RU, TR: 15 words, JA: 40 characters).

**When applies**: Always.

**Name in code**: SentenceLengthInTextAssessment

**Title URL**: [https://yoa.st/34v](https://yoast.com/the-sentence-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-length-in-text-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34w](https://yoast.com/the-sentence-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-length-in-text-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light |	Score |	Criterion | 	Feedback                                                                                                                                                         |
|------------------  |------------------	|--------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Red	| 3 |> 30% (cornerstone: 25%)                                                  | **Sentence length**: X of the sentences contain more than X words/characters, which is more than the recommended maximum of X%. **Try to shorten the sentences**. |
|Orange	| 6 |Between 25 and 30% (cornerstone: 20-25%, Turkish: 20-25%, Polish: 15-20%) | **Sentence length**: X of the sentences contain more than X words/characters, which is more than the recommended maximum of X%. **Try to shorten the sentences**. |
|Green	| 9 |≤ 25% (cornerstone: ≤ 20%; Polish: ≤ 15%)                                 | **Sentence length**: great!                                                                                                                                       |

### 4) Consecutive sentences
**What it does**: Checks whether there are more than 3 sentences in a row that start with the same word.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: SentenceBeginningsAssessment

**Title URL**: [https://yoa.st/35f](https://yoast.com/consecutive-sentences-check-yoast-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-beginnings-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35g](https://yoast.com/consecutive-sentences-check-yoast-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-beginnings-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light | Score | Criterion                                                  | Feedback                                                                                                                    |
|---------------|-------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Red           | 3     | 3 or more consecutive sentences start with the same word   | **Consecutive sentences**: The text contains X consecutive sentences starting with the same word. **Try to mix things up!** |
| Green         | 9     | Less than 3 consecutive sentences start with the same word | **Consecutive sentences**: There are no repetitive sentence beginnings. That's great!                                       |

### 5) Passive voice
**What it does**: Checks whether the number of sentences containing passive voice exceeds the recommended maximum amount.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: PassiveVoiceAssessment

**Title URL**: [https://yoa.st/34t](https://yoast.com/the-passive-voice-what-is-it-and-how-to-avoid-it/#utm_source=yoast-seo&utm_medium=software&utm_term=passive-voice-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34u](https://yoast.com/the-passive-voice-what-is-it-and-how-to-avoid-it/#utm_source=yoast-seo&utm_medium=software&utm_term=passive-voice-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light | Score | Criterion                       | Feedback                                                                                                                                                |
|---------------|-------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red           | 3     | > 15% of sentences              | **Passive voice**: X of the sentences contain passive voice, which is more than the recommended maximum of X. **Try to use their active counterparts**. |
| Orange        | 6     | Between 10 and 15% of sentences | **Passive voice**: X of the sentences contain passive voice, which is more than the recommended maximum of X. **Try to use their active counterparts**. |
| Green         | 9     | ≤ 10% of sentences              | **Passive voice**: You are not using too much passive voice. That's great!                                                                              |

### 6) Transition words
**What it does**: Checks whether there are enough sentences containing transition words.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: TransitionWordsAssessment

**Title URL**: [https://yoa.st/34z](https://yoast.com/transition-words-why-and-how-to-use-them/#utm_source=yoast-seo&utm_medium=software&utm_term=transition-words-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35a](https://yoast.com/transition-words-why-and-how-to-use-them/#utm_source=yoast-seo&utm_medium=software&utm_term=transition-words-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score	| Criterion                                                                                                        |	Feedback|
|-------|------	|------------------------------------------------------------------------------------------------------------------|------- |
|Red	|3| 	No transition words found in a long text (more than 200 words or 400 characters in Japanese)	                   |**Transition words**: None of the sentences contain transition words. **Use some**.|
|Red	|3| 	< 20% of sentences in a long text (more than 200 words or 400 characters in Japanese)	                          |**Transition words**: Only X of the sentences contain them. This is not enough. **Use more transition words**.|
|Orange	|6| 	Between 20 and 30% of sentences in a long text (more than 200 words or 400 characters in Japanese)              |**Transition words**: Only X of the sentences contain them. This is not enough. **Use more transition words**.|
|Green	|9| 	≥ 30% of sentences in a long text (more than 200 words or 400 characters in Japanese)                           |**Transition words**: Well done!|
|Green	|9| 	At least one sentence with transition words in a short text (less than 200 words or 400 characters in Japanese) |**Transition words**: Well done!|
|Green	|9| 	No transition words found in a short text (less than 200 words or 400 characters in Japanese)                   |**Transition words**: You are not using any transition words, but your text is short enough and probably doesn't need them.|


### 7) Text presence
**What it does**: Checks whether there is enough text in the copy

**Name in code**: TextPresenceAssessment

**Title URL**: [https://yoa.st/35h](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-presence-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35i](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-presence-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score|	Criterion|	Feedback|
|-------|------	|----- |------- |
|Red	|3	|< 50 characters	|**Not enough content**: **please add some content to enable a good analysis**.|

### 8) Word complexity (only in Premium)
**What it does**: Checks whether the text contains complex words. Word forms from the keyphrase are excluded.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: WordComplexityAssessment

**Title URL**: https://yoa.st/4ls (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/4lt (link placement is in bold in the feedback strings)

| Traffic light             | Score              | Criterion                                          | Feedback                                                                                                                                         |
|---------------------------|--------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Orange (cornerstone: red) | 6 (cornerstone: 3) | If the complex words are more than 10% in the text | **Word complexity**: X% of the words in your text are considered complex. **Try to use shorter and more familiar words to improve readability**. |
| Green                     | 9                  | If the complex words are less than 10% in the text | **Word complexity**: You are not using too many complex words, which makes your text easy to read. Good job!                                     |

### 9) Text alignment (only in Premium)
**What it does**: Checks whether there is an over-use of center-alignment in the text. By default, we check for the `.has-text-align-center` class, but this can be changed in the researcher configuration (`centerClasses`).

**When applies**: When the (sanitized) text has more than 50 characters and at least one paragraph or heading with center-alignment.

**Name in code**: TextAlignmentAssessment

**Title URL**: https://yoa.st/assessment-alignment (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/assessment-alignment-cta (link placement is in bold in the feedback strings)


| Traffic light | Score | Criterion                                                                   | Feedback                                                                                                          |
|---------------|-------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Red           | 2     | There is one center-aligned element that is over 50 characters long         | LTR: **Alignment**: There is a long section of center-aligned text. **We recommend making it left-aligned**.      |
|               |       |                                                                             | RTL: **Alignment**: There is a long section of center-aligned text. **We recommend making it right-aligned**.     |
| Red           | 2     | There are multiple center-aligned elements that are over 50 characters long | LTR: **Alignment**: There are X long sections of center-aligned text. **We recommend making them left-aligned**.  |
|               |       |                                                                             | RTL: **Alignment**: There are X long sections of center-aligned text. **We recommend making them right-aligned**. |

**Notes**:
* LTR: The feedback shown for languages written from left to right.
* RTL: The feedback shown for languages written from right to left.
