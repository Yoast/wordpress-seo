# Scoring SEO analysis
The SEO analysis is a collection of assessments that check how well a text performs with respect to SEO. Below is a detailed overview of how scores for the SEO assessments are calculated, as well as the feedback that each assessment returns.

At the moment, the exact way in which the assessments relating to **keyphrase use** work depends on the language of the user, as well as on which version of the plugin they are using (Free or Premium). This is because of the continuous development of morphological support, and the fact that morphology features are currently restricted to the premium version. These differences in language- and version-dependent functionalities are also outlined below.

## How are keyphrase-related assessments affected by language and plugin version?
There are three functionalities that depend on the user's language and/or plugin version:

* **Whether or not function words are filtered out from the keyphrase**. Function words are words that carry little meaning on their own (examples: 'my', 'to', 'of', 'very'). They are therefore unimportant to Google, and it makes little sense to consider them in our keyphrase-related assessments.

* **Whether or not it is possible to add synonyms of the keyphrase**. Keyphrase synonyms (e.g. keyphrase: 'bike', synonym: 'bicycle') added by the user are considered in some of the keyphrase-related assessments.

* **Whether or not morphological forms of the keyphrase are generated**. For example, if a keyphrase contains the word 'bike', all possible forms of the word are generated ('bikes', 'bike's', 'biking', 'biked'...) and considered in the assessments.

The availability of these features depends on which of the three language categories, outlined below, the user's language falls into. Within each category, a further distinction between Premium and Free users can be made.

### Group 1: All languages

#### Free
For all users, the majority of keyphrase-related assessments are now done using **per-word matching**, instead of **exact matching**. When exact matching is used, the assessments are only concerned with the exact keyphrase. For example, if the keyphrase is "room decorating ideas", an assessment that looks whether the keyphrase has been used in the first sentence of the text will only return a positive result if the exact phrase is found. When per-word matching is used, on the other hand, the result will be positive as long as the words 'room', 'decorating', and 'ideas' are found in the first sentence - but they don't need to appear next to each other and in that exact order.

#### Premium
All Premium users can also add **synonyms** of their keyphrase. Some of the assessments will then not only consider the keyphrase, but also its synonyms.

### Group 2: Languages for which we can filter out function words
A list of those languages can be found [here](https://github.com/Yoast/javascript/blob/master/packages/yoastseo/README.md#supported-languages) - look for the ones with a green tick in the 'function words' cell.

#### Free
In addition to per-word matching, we also filter out **function words** from the keyphrase during the keyword-related assessments. For example, if the keyphrase is "how to decorate a room", we filter out the words 'how', 'to', and 'a', and only leave out the meaningful words 'decorate' and 'room'. This means that if we look, for example, if the keyphrase has been used in the introduction of the text, we are only looking for the words 'decorate' and 'room'.

#### Premium
In addition to the above, Premium users can add **synonyms** of their keyphrase.

### Group 3: English language

#### Free
Free users with English as their language have access to the same functionalities as Free users of group 2 (filtering out **function words** and **per-word matching**)

#### Premium
Premium users have access to **full morphological support**. This means that in addition to all other functionalities mentioned above, **all possible forms of their keyphrase and all possible forms of their synonyms** are generated. It depends on the assessment whether synonym forms will be taken into consideration or not (see per-assessment specifications below). For example, if the keyphrase is "room decorating ideas" and the synonym is "apartment decorating ideas" all the possible forms of each word are generated: 'apartments', 'rooms', 'room's', 'decorate', 'decorates', 'decorated', 'idea', etc. These are then taken into account during the keyword-related assessments, after possible function words have been filtered out.

### Summary
|    	      | All languages	     | Function words developed | English 	|
|------------	|------------------	|---------------------	|---------------	|
| Free        | Per-word matching    | Per-word matching, filtering out function words | Per-word matching, filtering out function words |
| Premium	  | The above + synonyms | The above + synonyms	      | The above + synonyms + morphological forms of keyphrase and synonyms |

### Important
Per-word matching, filtering out of function words and morphological forms of keyphrase and synonyms **can be suppressed** by using double quotations marks around the keyphrase or around a synonym. E.g., `"SEO analysis"`.

## How are individual bullets assigned?
| Individual score	| Rating	     |
|------------	|------------------	|
| 0 (if it is not explicitly set as a score)		| Feedback (gray) |
| ≤4		| Bad (red circle) |
| 5-7		| OK (orange circle) |
| 8-10		| Good (Green circle)|

## How is the overall score calculated?

* Overall score = (sum of individual scores)/(number of results *9 ) * 10
* Round this number.

## Keyphrase-based SEO assessments
### Keyphrase in introduction
**What it does**: Checks whether words from the keyphrase can be found in the first paragraph of the text.

**Uses synonyms**: yes

**When applies**: If there is a text and a keyword.

**Name in code**: IntroductionKeywordAssessment

**Title URL**: https://yoa.st/33e (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33f (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red   	      | 3	     | Not all content words are found in the first paragraph	 | **Keyphrase in introduction**: Your keyphrase or its synonyms do not appear in the first paragraph. **Make sure the topic is clear immediately**. |
| Orange   	      | 6	     | All content words are found in the first paragraph, but not in the same sentence	 | **Keyphrase in introduction**: Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. **Fix that**! |
| Green   	      | 9	     | All content words from the keyphrase or synonym phrase are within one sentence in the first paragraph	 | **Keyphrase in introduction**: Well done! |

### Keyphrase length
**What it does**: Checks whether the number of ( content ) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.

**Uses synonyms**: no

**When applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**Title URL**: https://yoa.st/33i (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33j (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red   	      | -999	     | No focus keyword set		 | **Keyphrase length**: No focus keyphrase was set for this page. **Set a focus keyphrase in order to calculate your SEO score**. |
| Red   	      | 3		     | Keyphrase length > 8 words (> 9 for languages without function words support)	 | **Keyphrase length**: The keyphrase is x words long. That's way more than the recommended maximum of 4 words. **Make it shorter!**|
| Orange   	      | 6	     | Keyphrase length between 5-8 words (7-9 for languages without function words support)		 | **Keyphrase length**: The keyphrase is x words long. That's more than the recommended maximum of 4 words. **Make it shorter!**|
| Green   	      | 9	     | Keyphrase length between 1-4 words (1-6 or languages without function words support)		 | **Keyphrase length**: Good job! |


