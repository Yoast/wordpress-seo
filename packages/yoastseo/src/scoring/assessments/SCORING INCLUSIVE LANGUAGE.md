# Overview of the inclusive language analysis scoring criteria

The inclusive language analysis checks whether your content contains any (potentially) non-inclusive words or phrases.
The analysis is not available in all languages, check [this overview to see which languages have inclusive language support](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo/README.md#inclusive-language-analysis).

## How are individual traffic lights assigned?
For every (potentially) non-inclusive word or phrase that is found in the text, a red or orange traffic light is shown.
A red traffic light means that the targeted word or phrase is never inclusive, regardless of context.
An orange traffic light means that the targeted word or phrase is _potentially_ non-inclusive, depending on the context in which it is used.

| Individual Score | Rating 	                  |
|------------	   |---------------------------|
|3	               | Bad (red traffic light)   |
|6		           | Ok (orange traffic light) |

## How is the overall score calculated?
| Individual scores	 | Total score	| Divide by 10:             |
|------------	         |------------------	|---------------------------|
| At least one individual score of 3        |30		            | 3 (red traffic light)	    |
| Zero individual scores of 3 and at least one individual score of 6         |60		            | 6 (orange traffic light)	 |
| Zero individual scores of 3 or 6	     |90                    | 9 (green traffic light) |

## More details on the individual phrases and feedback
The targeted words and phrases are divided into the following categories:
* [age](inclusiveLanguage/configuration/ageAssessments.js)
* [appearance](inclusiveLanguage/configuration/appearanceAssessments.js)
* [culture](inclusiveLanguage/configuration/cultureAssessments.js)
* [disability](inclusiveLanguage/configuration/disabilityAssessments.js)
* [gender](inclusiveLanguage/configuration/genderAssessments.js)
* [socio-economic status](inclusiveLanguage/configuration/sesAssessments.js)
* [other](inclusiveLanguage/configuration/otherAssessments.js)

The list of targeted words and phrases, together with the feedback strings that are shown for each found word/phrase,
can be found in the files linked in the list above.

Each object in these files represents a targeted word/phrase, or sometimes a set of word/phrases with the same properties.
- The `nonInclusivePhrases` property of the object contains the targeted word(s) or phrase(s)
- The `inclusiveAlternatives` property contains the inclusive alternatives that are suggested in the feedback string
- The `score` property contains the score associated with the word/phrase (3 or 6, corresponding to red or orange traffic light)
- The `feedbackFormat` property contains the feedback string that should be shown if this word/phrase is found.
- The `learnMoreUrl` property contains the URL to a help article for the category that the word/phrase belongs to (so the URL is the same for the whole file)
- The `caseSensitive` property specifies whether the word/phrase should be targeted only if it is found in the same case as in `nonInclusivePhrases` (if the property is absent, the default value of `false` applies)
- The (optional) `rule` property specifies a rule based on which the word/phrase should be targeted. For example, if a word/phrase should only be targeted if specific words precede or follow it.


