# Overview of the Readability assessments scoring criteria

Readability analysis is a collection of assessments that check how easy to read a text is. Some of the readability assessments are language-independent (e.g. paragraph length, subheading presence, and distribution), but many are language-specific (e.g. passive voice, transition words) and are made available for different languages on a case-by-case basis.
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

Below is a detailed overview of how scores for the readability assessments are calculated, as well as the feedback that each assessment returns. Note: some of the assessment criteria are different for texts marked as cornerstone; these will be indicated when applicable. Also, some assessment criteria (e.g. recommended sentence length) differ depending on the specific language. These are not specified below for the sake of space-saving.

## Scoring criteria for the readability assessments
### 1) Subheading distribution
**What it does**: Checks whether long texts are divided by subheadings.

**When applies**: When the (sanitized) text has more than 50 characters.

**Name in code**: SubheadingsDistributionTooLong

**Title URL**: [https://yoa.st/34x](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheading-distributrion-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34y](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheading-distributrion-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion | Feedback |
|-----------------|------------------	|--------------------- |---------------------|
| Red             |2	| **Default**: A text with more than 300 words (cornerstone: 250) and no subheading is present. **Japanese**: A text with more than 600 characters (cornerstone: 500) and no subheading is present. | **Subheading distribution**: You are not using any subheadings, although your text is rather long. Try and add some subheadings. |
| Red             |3	| **Default**: There is subheading(s) in the text and it is followed and preceded (if applicable) by more than 350 words (cornerstone: 300). **Japanese**: There is subheading(s) in the text and it is followed and preceded (if applicable) by more than 700 characters (cornerstone: 600).| **Subheading distribution**: X sections of your text are longer than X words and are not separated by any subheadings. Add subheadings to improve readability.|
| Red             |3	| **Default**: There is subheading(s) in the text in which the first one is preceded by a text longer than 350 words (cornerstone: 300). And the texts following the subheading(s) is less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text in which the first one is preceded by a text longer than 700 characters (cornerstone: 600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).  | **Subheading distribution**: The beginning of your text is longer than X words and is not separated by any subheadings. Add subheadings to improve readability.|
| Orange          |6 | **Default**: Subheading followed by 300-350 words (cornerstone: 250-300). **Japanese**: Subheading followed by 600-700 characters (cornerstone: 500-600) | **Subheading distribution**: X sections of your text are longer than X words and are not separated by any subheadings. Add subheadings to improve readability.|
| Orange          |6	| **Default**: There is subheading(s) in the text in which the first one is preceded by a text between 300-350 words (cornerstone: 250-300). And the texts following the subheading(s) is less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text in which the first one is preceded by a text between 600-700 characters (cornerstone: 500-600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).      | **Subheading distribution**: The beginning of your text is longer than X words and is not separated by any subheadings. Add subheadings to improve readability.|
| Green           |9 | **Default**: A text with 300 or less words and no subheading is present. **Japanese**: A text with 600 or less characters and no subheading is present. | **Subheading distribution**: You are not using any subheadings, but your text is short enough and probably doesn't need them.|
| Green           |9 | **Default**: There is subheading(s) in the text and it is followed and preceded (if applicable) by less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text and it is followed and preceded (if applicable) by less than 600 characters (cornerstone: 500). | **Subheading distribution**:  Great job!|

### 2) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: When the (sanitized) text has more than 50 characters. This is tied to the TextPresenceAssessment.

**Name in code**: ParagraphTooLongAssessment

**Title URL**: [https://yoa.st/35d](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35e](https://yoast.com/paragraph-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=paragraph-length-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light 	 | Score	| Criterion | Feedback |
|------------|------------------	|--------------------- |---------------------|
| Red        |3	                |> 200 words	   	          |**Paragraph length**: X of the paragraphs contain more than the recommended maximum of X words. **Shorten your paragraphs!**|
| Orange     |6                 |Between 150 and 200 words    |**Paragraph length**: X of the paragraphs contain more than the recommended maximum of X words. **Shorten your paragraphs!**|
| Green      |9                 |≤ 150 words	              |**Paragraph length**: none of the paragraphs are too long. Great job! |

### 3) Sentence length
**What it does**: Checks whether the sentences exceed the recommended maximum length (default: 20 words, IT: 25 words, RU: 15 words, HE: 15 words, TR: 15 words).

**When applies**: When the (sanitized) has more than 50 characters. This is tied to the TextPresenceAssessment.

**Name in code**: SentenceLengthInTextAssessment

**Title URL**: [https://yoa.st/34v](https://yoast.com/the-sentence-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-length-in-text-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34w](https://yoast.com/the-sentence-length-check/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-length-in-text-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light |	Score |	Criterion |	Feedback |
|------------------  |------------------	|--------------------- |--------------------- |
|Red	| 3 |> 30% (cornerstone: 25%)                                                  |**Sentence length**: X of the sentences contain more than X words, which is more than the recommended maximum of X. **Try to shorten the sentences**. |
|Orange	| 6 |Between 25 and 30% (cornerstone: 20-25%, Turkish: 20-25%, Polish: 15-20%) |**Sentence length**: X of the sentences contain more than X words, which is more than the recommended maximum of X. **Try to shorten the sentences**. |
|Green	| 9 |≤ 25% (cornerstone: ≤ 20%; Polish: ≤ 15%)                                 |**Sentence length**: great! |

### 4) Consecutive sentences
**What it does**: Checks whether there are more than 3 sentences in a row that start with the same word.

**When applies**: When the (sanitized) text has more than 50 characters (this is tied to the TextPresenceAssessment), and the research has a result.

**Name in code**: SentenceBeginningsAssessment

**Title URL**: [https://yoa.st/35f](https://yoast.com/consecutive-sentences-check-yoast-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-beginnings-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35g](https://yoast.com/consecutive-sentences-check-yoast-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=sentence-beginnings-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score|	Criterion	|Feedback|
|------------------  |------------------	|--------------------- |--------------------- |
|Red	|3 |3 or more consecutive sentences start with the same word	|**Consecutive sentences**: the text contains X consecutive sentences starting with the same word. **Try to mix things up!**|
|Green	|9 |Less than 3 consecutive sentences start with the same word	|**Consecutive sentences**: there is enough variety in your sentences. That's great!|

### 5) Passive voice
**What it does**: Checks whether the number of sentences containing passive voice exceeds the recommended maximum amount.

**When applies**: When the (sanitized) text has more than 50 characters (this is tied to the TextPresenceAssessment), and the assessment is supported in the specific language (the researcher has a research).

**Name in code**: PassiveVoiceAssessment

**Title URL**: [https://yoa.st/34t](https://yoast.com/the-passive-voice-what-is-it-and-how-to-avoid-it/#utm_source=yoast-seo&utm_medium=software&utm_term=passive-voice-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34u](https://yoast.com/the-passive-voice-what-is-it-and-how-to-avoid-it/#utm_source=yoast-seo&utm_medium=software&utm_term=passive-voice-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score |	Criterion|	Feedback|
|-------|------	|----- |------- |
|Red	|3	|> 15% of sentences              |**Passive voice**: X of the sentences contain passive voice, which is more than the recommended maximum of X. **Try to use their active counterparts**. |
|Orange	|6	|Between 10 and 15% of sentences |**Passive voice**: X of the sentences contain passive voice, which is more than the recommended maximum of X. **Try to use their active counterparts**.|
|Green	|9	|≤ 10% of sentences              |**Passive voice**: you're using enough active voice. That's great!|

### 6) Transition words
**What it does**: Checks whether there are enough sentences containing transition words.

**When applies**: When there is at least 200 words in the text

**Name in code**: TransitionWordsAssessment

**Title URL**: [https://yoa.st/34z](https://yoast.com/transition-words-why-and-how-to-use-them/#utm_source=yoast-seo&utm_medium=software&utm_term=transition-words-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35a](https://yoast.com/transition-words-why-and-how-to-use-them/#utm_source=yoast-seo&utm_medium=software&utm_term=transition-words-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score	|Criterion|	Feedback|
|-------|------	|----- |------- |
|Red	|3|	No transition words found	   |**Transition words**: None of the sentences contain transition words. **Use some**.|
|Red	|3|	< 20% of sentences	           |**Transition words**: Only X of the sentences contain them. This is not enough. **Use more transition words**.|
|Orange	|6|	Between 20 and 30% of sentences|**Transition words**: Only X of the sentences contain them. This is not enough. **Use more transition words**.|
|Green	|9|	≥ 30% of sentences             |**Transition words**: Well done!|

### 7) Flesch Reading Ease
**What it does**: Checks how easy to read the text is according to the Flesch Reading Ease test

**When applies**: When the (sanitized) text has more than 50 characters (this is tied to the TextPresenceAssessment), and the assessment is supported in the specific language (the researcher has a research).

**Name in code**: FleschReadingEaseAssessment

**Title URL**: [https://yoa.st/34r](https://yoast.com/flesch-reading-ease-score/#utm_source=yoast-seo&utm_medium=software&utm_term=flesch-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34s](https://yoast.com/flesch-reading-ease-score/#utm_source=yoast-seo&utm_medium=software&utm_term=flesch-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score	|Criterion|	Feedback|
|-------|------	|----- |------- |
|Red	|3 |	< 30	          |**Flesch Reading Ease**: The copy scores X in the test, which is considered X to read. **Try to make shorter sentences, using less difficult words to improve readability**.|
|Red	|3 |	Between 30 and 50 |**Flesch Reading Ease**: The copy scores X in the test, which is considered X to read. **Try to make shorter sentences, using less difficult words to improve readability**.|
|Orange	|6 |	Between 50 and 60 |**Flesch Reading Ease**: The copy scores X in the test, which is considered X to read. **Try to make shorter sentences to improve readability**.|
|Green	|9 |	> 60              |**Flesch Reading Ease**: The copy scores X in the test, which is considered X to read. Good job! |

### 8) Text presence
**What it does**: Checks whether there is enough text in the copy

**Name in code**: TextPresenceAssessment

**Title URL**: [https://yoa.st/35h](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-presence-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/35i](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-presence-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

|Traffic light	|Score|	Criterion|	Feedback|
|-------|------	|----- |------- |
|Red	|3	|< 50 characters	|**Not enough content**: **please add some content to enable a good analysis**.|

### 9) Word complexity (only in Premium)
**What it does**: Checks whether the text contains complex words. Word forms from the keyphrase are excluded.

**When applies**: When the (sanitized) text has more than 50 characters

**Name in code**: WordComplexityAssessment

**Title URL**: https://yoa.st/4ls (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/4lt (link placement is in bold in the feedback strings)

| Traffic light             | Score              | Criterion                                          | Feedback                                                                                                                                         |
|---------------------------|--------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Orange (cornerstone: red) | 6 (cornerstone: 3) | If the complex words are more than 10% in the text | **Word complexity**: X% of the words in your text are considered complex. **Try to use shorter and more familiar words to improve readability**. |
| Green                     | 9                  | If the complex words are less than 10% in the text | **Word complexity**: You are not using too many complex words, which makes your text easy to read. Good job!                                     |

### 10) Text alignment (only in Premium)
**What it does**: Checks whether there is an over-use of center-alignment in the text.

**When applies**: When the (sanitized) text has more than 50 characters and at least one paragraph or heading with center-alignment.

**Name in code**: TextAlignmentAssessment

**Title URL**: https://yoa.st/assessment-alignment (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/assessment-alignment-cta (link placement is in bold in the feedback strings)


| Traffic light         | Score 	| Criterion    | Feedback	|
|----------------|-------	|-------- |---------------------------------	|
| Red     | 2     	| There is one element with `.has-text-align-center` that is over 50 characters long                 	| LTR: **Alignment**: There is a long section of center-aligned text. **We recommend making it left-aligned**. |
|      |     	|  	| RTL: **Alignment**: There is a long section of center-aligned text. **We recommend making it right-aligned**. 	|
| Red     | 2     	| There are multiple elements with <br>`.has-text-align-center`<br> that are over 50 characters long 	| LTR: **Alignment**: There are X long sections of center-aligned text. **We recommend making them left-aligned**. 	|
|      |     	| 	| RTL: **Alignment**: There are X long sections of center-aligned text. **We recommend making them right-aligned**. 	|

**Notes**:
* LTR: The feedback shown for languages written from left to right.
* RTL: The feedback shown for languages written from right to left.
